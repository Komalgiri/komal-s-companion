import type { SpeechMessage, Task } from "./types";

let counter = 0;
export const makeMessage = (
  text: string,
  tone: SpeechMessage["tone"],
  avatarState: SpeechMessage["avatarState"],
): SpeechMessage => ({ id: `msg-${++counter}-${Date.now()}`, text, tone, avatarState });

export function greeting(name: string, hour: number): SpeechMessage {
  if (hour < 5) return makeMessage(`Still up, ${name}? 🌙`, "calm", "sleeping");
  if (hour < 12) return makeMessage(`Good morning, ${name}! ☀️`, "cheer", "happy");
  if (hour < 17) return makeMessage(`Afternoon check-in, ${name} ✨`, "info", "idle");
  if (hour < 21) return makeMessage(`Evening, ${name}. Let's wrap up nicely.`, "info", "idle");
  return makeMessage("It's getting late. Time to wind down. 🌙", "calm", "sleeping");
}

export function remainingMessage(count: number): SpeechMessage {
  if (count === 0) return makeMessage("All done for today! 🎉", "cheer", "celebration");
  return makeMessage(
    `You have ${count} task${count === 1 ? "" : "s"} left today.`,
    "info",
    "reminder",
  );
}

export const completedMessage = () =>
  makeMessage("Nice! One more done. 💚", "cheer", "taskDone");

export const breakMessage = () =>
  makeMessage("Need a break? Stretch and grab some water ☕", "calm", "thinking");

export function staleMessage(task: Task, days: number): SpeechMessage {
  return makeMessage(
    `"${task.title}" has been pending for ${days} day${days === 1 ? "" : "s"} 👀`,
    "warn",
    "sad",
  );
}

export const reminderMessage = (task: Task) =>
  makeMessage(`Reminder: ${task.title} ⏰`, "warn", "reminder");

export const snoozeMessage = (minutes: number) =>
  makeMessage(`Okay, I'll nudge you again in ${minutes} min 😴`, "calm", "idle");
