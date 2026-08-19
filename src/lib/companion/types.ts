export type AvatarState =
  | "idle"
  | "walking"
  | "happy"
  | "thinking"
  | "reminder"
  | "taskDone"
  | "sad"
  | "sleeping"
  | "celebration";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  /** "HH:mm" 24h local reminder time, or null when no reminder is set. */
  reminderAt: string | null;
  createdAt: number;
  completedAt: number | null;
  /** Epoch ms until which reminders for this task are muted. */
  snoozedUntil: number | null;
}

export interface CompanionSettings {
  userName: string;
  remindersEnabled: boolean;
  snoozeMinutes: number;
  /** Minutes between gentle break nudges. 0 disables them. */
  breakIntervalMinutes: number;
  windDownHour: number;
  soundEnabled: boolean;
}

export interface SpeechMessage {
  id: string;
  text: string;
  tone: "info" | "cheer" | "warn" | "calm";
  avatarState: AvatarState;
}

export const DEFAULT_SETTINGS: CompanionSettings = {
  userName: "Komal",
  remindersEnabled: true,
  snoozeMinutes: 10,
  breakIntervalMinutes: 45,
  windDownHour: 22,
  soundEnabled: false,
};
