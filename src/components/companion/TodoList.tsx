import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { NewTaskInput } from "@/hooks/useTasks";
import type { Task } from "@/lib/companion/types";
import { cn } from "@/lib/utils";

interface TodoListProps {
  tasks: Task[];
  onAdd: (input: NewTaskInput) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSnooze: (id: string) => void;
  className?: string;
}

type Filter = "all" | "open" | "done";

export function TodoList({ tasks, onAdd, onToggle, onRemove, onSnooze, className }: TodoListProps) {
  const [title, setTitle] = useState("");
  const [reminder, setReminder] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done,
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, reminderAt: reminder || null });
    setTitle("");
    setReminder("");
  };

  return (
    <section className={cn("flex min-h-0 flex-col gap-3", className)}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-base font-bold">Today's list</h2>
        <div className="flex shrink-0 gap-1 rounded-full bg-muted p-1">
          {(["all", "open", "done"] as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.68rem] font-bold capitalize transition-colors",
                filter === key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={submit} className="soft-card grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-3xl p-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a tiny task…"
          aria-label="Task title"
          className="min-w-0 rounded-2xl bg-transparent px-3 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground"
        />
        <div className="flex shrink-0 items-center gap-1">
          <label className="flex items-center gap-1 rounded-2xl bg-muted px-2 py-1.5 text-xs font-semibold">
            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              aria-label="Reminder time"
              className="w-[4.6rem] bg-transparent text-xs font-bold outline-none"
            />
          </label>
          <button
            type="button"
            onClick={submit}
            aria-label="Add task"
            className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </form>

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
        {visible.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onRemove={onRemove}
            onSnooze={onSnooze}
          />
        ))}
        {visible.length === 0 && (
          <li className="rounded-3xl border border-dashed border-border px-4 py-6 text-center text-sm font-semibold text-muted-foreground">
            Nothing here yet — a clean slate ✨
          </li>
        )}
      </ul>
    </section>
  );
}
