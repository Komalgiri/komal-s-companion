import { DEFAULT_SETTINGS, type CompanionSettings, type Task } from "./types";

const TASKS_KEY = "tiny-komal:tasks:v1";
const SETTINGS_KEY = "tiny-komal:settings:v1";

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

const day = 24 * 60 * 60 * 1000;

export const mockTasks = (): Task[] => [
  {
    id: "seed-1",
    title: "Finish the Tiny Komal mockup",
    done: false,
    reminderAt: "10:30",
    createdAt: Date.now() - 3 * day,
    completedAt: null,
    snoozedUntil: null,
  },
  {
    id: "seed-2",
    title: "Drink water 🥤",
    done: false,
    reminderAt: "14:00",
    createdAt: Date.now() - day,
    completedAt: null,
    snoozedUntil: null,
  },
  {
    id: "seed-3",
    title: "Morning stretch",
    done: true,
    reminderAt: null,
    createdAt: Date.now() - day,
    completedAt: Date.now() - 2 * 60 * 60 * 1000,
    snoozedUntil: null,
  },
];

export function loadTasks(): Task[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(TASKS_KEY);
    if (!raw) return mockTasks();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : mockTasks();
  } catch {
    return mockTasks();
  }
}

export const saveTasks = (tasks: Task[]) => write(TASKS_KEY, tasks);

export const loadSettings = (): CompanionSettings =>
  read<CompanionSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);

export const saveSettings = (settings: CompanionSettings) => write(SETTINGS_KEY, settings);
