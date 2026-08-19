import { useCallback, useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks } from "@/lib/companion/storage";
import type { Task } from "@/lib/companion/types";

export interface NewTaskInput {
  title: string;
  reminderAt: string | null;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTasks(tasks);
  }, [tasks, hydrated]);

  const addTask = useCallback(({ title, reminderAt }: NewTaskInput) => {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim(),
      done: false,
      reminderAt,
      createdAt: Date.now(),
      completedAt: null,
      snoozedUntil: null,
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const toggleTask = useCallback((id: string) => {
    let becameDone = false;
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        becameDone = !task.done;
        return {
          ...task,
          done: becameDone,
          completedAt: becameDone ? Date.now() : null,
        };
      }),
    );
    return becameDone;
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const snoozeTask = useCallback((id: string, minutes: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, snoozedUntil: Date.now() + minutes * 60_000 } : task,
      ),
    );
  }, []);

  const setReminder = useCallback((id: string, reminderAt: string | null) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, reminderAt, snoozedUntil: null } : task)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.done));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const remaining = total - done;
    const withReminders = tasks.filter((t) => !t.done && t.reminderAt).length;
    const oldest = tasks
      .filter((t) => !t.done)
      .reduce<number | null>((acc, t) => (acc === null ? t.createdAt : Math.min(acc, t.createdAt)), null);
    return {
      total,
      done,
      remaining,
      withReminders,
      oldestPendingAt: oldest,
      progress: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [tasks]);

  return {
    tasks,
    hydrated,
    stats,
    addTask,
    toggleTask,
    removeTask,
    snoozeTask,
    setReminder,
    clearCompleted,
  };
}
