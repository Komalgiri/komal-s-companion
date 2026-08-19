import { useCallback, useEffect, useRef, useState } from "react";
import {
  breakMessage,
  completedMessage,
  greeting,
  reminderMessage,
  remainingMessage,
  snoozeMessage,
  staleMessage,
} from "@/lib/companion/messages";
import { daysBetween, minutesSinceMidnight, parseReminderMinutes } from "@/lib/companion/time";
import type { AvatarState, CompanionSettings, SpeechMessage, Task } from "@/lib/companion/types";

interface UseCompanionArgs {
  now: Date | null;
  tasks: Task[];
  settings: CompanionSettings;
  remaining: number;
}

/**
 * Drives the avatar state machine, the speech bubble queue and the reminder
 * scheduler. Kept UI-free so an Electron main process can reuse the logic.
 */
export function useCompanion({ now, tasks, settings, remaining }: UseCompanionArgs) {
  const [message, setMessage] = useState<SpeechMessage | null>(null);
  const [transientState, setTransientState] = useState<AvatarState | null>(null);
  const [dueTask, setDueTask] = useState<Task | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const lastBreakRef = useRef<number>(Date.now());
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
    if (!now || greetedRef.current) return;
    greetedRef.current = true;
    say(greeting(settings.userName, now.getHours()));
    const id = window.setTimeout(() => say(remainingMessage(remaining)), 6500);
    return () => window.clearTimeout(id);
  }, [now, settings.userName, remaining, say]);

  // Reminder scheduler + stale-task and break nudges.
  useEffect(() => {
    if (!now) return;
    const nowMinutes = minutesSinceMidnight(now);
    const stamp = now.toDateString();

    if (settings.remindersEnabled && !dueTask) {
      const due = tasks.find((task) => {
        if (task.done || !task.reminderAt) return false;
        if (task.snoozedUntil && task.snoozedUntil > Date.now()) return false;
        if (firedRef.current.has(`${stamp}:${task.id}:${task.snoozedUntil ?? 0}`)) return false;
        return parseReminderMinutes(task.reminderAt) <= nowMinutes;
      });
      if (due) {
        firedRef.current.add(`${stamp}:${due.id}:${due.snoozedUntil ?? 0}`);
        setDueTask(due);
        say(reminderMessage(due), 8000);
        return;
      }
    }

    const interval = settings.breakIntervalMinutes;
    if (interval > 0 && Date.now() - lastBreakRef.current > interval * 60_000) {
      lastBreakRef.current = Date.now();
      const stale = tasks.find((t) => !t.done && daysBetween(t.createdAt, Date.now()) >= 3);
      say(stale ? staleMessage(stale, daysBetween(stale.createdAt, Date.now())) : breakMessage());
    }
  }, [now, tasks, settings.remindersEnabled, settings.breakIntervalMinutes, dueTask, say]);

  const baseState: AvatarState = (() => {
    if (!now) return "idle";
    const hour = now.getHours();
    if (hour >= settings.windDownHour || hour < 5) return "sleeping";
    if (remaining === 0 && tasks.length > 0) return "celebration";
    if (tasks.some((t) => !t.done && daysBetween(t.createdAt, Date.now()) >= 3)) return "sad";
    return "idle";
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
