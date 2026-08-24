import { useCallback, useEffect, useRef, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import {
  breakMessage,
  completedMessage,
  greeting,
  reminderMessage,
  remainingMessage,
  snoozeMessage,
  staleMessage,
  habitMessage,
  weatherGreeting,
} from "@/lib/companion/messages";
import { daysBetween, minutesSinceMidnight, parseReminderMinutes } from "@/lib/companion/time";
import type { AvatarState, CompanionSettings, SpeechMessage, Task } from "@/lib/companion/types";

interface UseCompanionArgs {
  now: Date | null;
  tasks: Task[];
  settings: CompanionSettings;
  remaining: number;
  isFocusing?: boolean;
}

/**
 * Drives the avatar state machine, the speech bubble queue and the reminder
 * scheduler. Kept UI-free so an Electron main process can reuse the logic.
 */
export function useCompanion({ now, tasks, settings, remaining, isFocusing }: UseCompanionArgs) {
  const { weather, loading } = useWeather();
  const [message, setMessage] = useState<SpeechMessage | null>(null);
  const [transientState, setTransientState] = useState<AvatarState | null>(null);
  const [dueTask, setDueTask] = useState<Task | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const lastBreakRef = useRef<number>(Date.now());
  const lastHabitFiredRef = useRef<Record<string, number>>({});
  const greetedRef = useRef(false);
  const resetRef = useRef<number | null>(null);

  const say = useCallback((next: SpeechMessage, holdMs = 6000) => {
    setMessage(next);
    setTransientState(next.avatarState);
    if (resetRef.current) window.clearTimeout(resetRef.current);
    resetRef.current = window.setTimeout(() => setTransientState(null), holdMs);
  }, []);

  // Greeting on first tick.
  useEffect(() => {
    if (!now || greetedRef.current || loading) return;
    greetedRef.current = true;
    say(weatherGreeting(settings.userName, now.getHours(), weather));
    const id = window.setTimeout(() => say(remainingMessage(remaining)), 6500);
    return () => window.clearTimeout(id);
  }, [now, settings.userName, remaining, say, weather, loading]);

  const [randomIdle, setRandomIdle] = useState<AvatarState>("idle");

  // Random idle gestures
  useEffect(() => {
    const interval = window.setInterval(() => {
      const states: AvatarState[] = ["idle", "thinking", "walking", "happy", "idle", "idle"];
      setRandomIdle(states[Math.floor(Math.random() * states.length)] ?? "idle");
    }, 12000); // change every 12 seconds
    return () => window.clearInterval(interval);
  }, []);

  // Reminder scheduler + stale-task and break nudges.
  useEffect(() => {
    if (!now) return;
    const nowMinutes = minutesSinceMidnight(now);
    const stamp = now.toDateString();

    if (settings.remindersEnabled && !dueTask) {
      const dueTasks = tasks.filter((task) => {
        if (task.done || !task.reminderAt) return false;
        if (task.snoozedUntil && task.snoozedUntil > Date.now()) return false;
        if (firedRef.current.has(`${stamp}:${task.id}:${task.snoozedUntil ?? 0}`)) return false;
        return parseReminderMinutes(task.reminderAt) <= nowMinutes;
      });

      if (dueTasks.length > 0) {
        // Find the task that is closest to now (most recently due)
        const due = dueTasks.reduce((latest, current) => {
          return parseReminderMinutes(current.reminderAt!) > parseReminderMinutes(latest.reminderAt!) ? current : latest;
        });
        
        firedRef.current.add(`${stamp}:${due.id}:${due.snoozedUntil ?? 0}`);
        setDueTask(due);
        say(reminderMessage(due), 8000);
        return;
      }
    }

    // Check habits
    if (settings.habits && settings.habits.length > 0) {
      for (const habit of settings.habits) {
        if (!habit.enabled || habit.intervalMinutes <= 0) continue;
        
        // Initialize to now so it doesn't fire immediately
        if (!(habit.id in lastHabitFiredRef.current)) {
          lastHabitFiredRef.current[habit.id] = Date.now();
        }

        const lastFired = lastHabitFiredRef.current[habit.id]!;
        if (Date.now() - lastFired > habit.intervalMinutes * 60_000) {
          lastHabitFiredRef.current[habit.id] = Date.now();
          say(habitMessage(habit.title), 8000);
          return;
        }
      }
    }

    const interval = settings.breakIntervalMinutes;
    if (interval > 0 && Date.now() - lastBreakRef.current > interval * 60_000) {
      lastBreakRef.current = Date.now();
      const stale = tasks.find((t) => !t.done && daysBetween(t.createdAt, Date.now()) >= 3);
      say(stale ? staleMessage(stale, daysBetween(stale.createdAt, Date.now())) : breakMessage());
    }
  }, [now, tasks, settings.remindersEnabled, settings.breakIntervalMinutes, settings.habits, dueTask, say]);

  const baseState: AvatarState = (() => {
    if (!now) return "idle";
    if (isFocusing) return "thinking";
    const hour = now.getHours();
    if (hour >= settings.windDownHour || hour < 5) return "sleeping";
    if (remaining === 0 && tasks.length > 0) return "celebration";
    if (tasks.some((t) => !t.done && daysBetween(t.createdAt, Date.now()) >= 3)) return "sad";
    return randomIdle;
  })();

  const announceCompletion = useCallback(
    (becameDone: boolean, remainingAfter: number) => {
      if (!becameDone) return;
      say(remainingAfter === 0 ? remainingMessage(0) : completedMessage(), 5000);
    },
    [say],
  );

  const announceSnooze = useCallback(
    (minutes: number) => say(snoozeMessage(minutes), 4000),
    [say],
  );

  return {
    message,
    setMessage,
    avatarState: transientState ?? baseState,
    dueTask,
    clearDueTask: () => setDueTask(null),
    say,
    announceCompletion,
    announceSnooze,
    setTransientState,
  };
}
