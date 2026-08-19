import { Bell, BellOff, Check, Clock3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysBetween, formatReminder } from "@/lib/companion/time";
import type { Task } from "@/lib/companion/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSnooze: (id: string) => void;
}

export function TaskCard({ task, onToggle, onRemove, onSnooze }: TaskCardProps) {
  const age = daysBetween(task.createdAt, Date.now());
  const stale = !task.done && age >= 3;
  const snoozed = task.snoozedUntil !== null && task.snoozedUntil > Date.now();

  return (
    <li
      className={cn(
        "soft-card group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl px-3 py-2.5 transition-all duration-200",
        task.done && "opacity-60",
        stale && "ring-1 ring-primary/40",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
          task.done
            ? "border-transparent bg-mint text-foreground"
            : "border-border bg-card hover:scale-110 hover:border-primary",
        )}
      >
        {task.done && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>

      <div className="min-w-0">
        <p className={cn("truncate text-sm font-bold", task.done && "line-through")}>
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.68rem] font-semibold text-muted-foreground">
          {task.reminderAt ? (
            <span className="inline-flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {formatReminder(task.reminderAt)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <BellOff className="h-3 w-3" />
              no reminder
            </span>
          )}
          {snoozed && <span className="text-accent-foreground">snoozed</span>}
          {stale && <span className="text-primary-foreground">pending {age}d 👀</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
        {!task.done && task.reminderAt && (
          <button
            type="button"
            onClick={() => onSnooze(task.id)}
            aria-label={`Snooze ${task.title}`}
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <Clock3 className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(task.id)}
          aria-label={`Delete ${task.title}`}
          className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}
