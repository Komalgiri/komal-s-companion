import { AlarmClock, Check, X } from "lucide-react";
import { formatReminder } from "@/lib/companion/time";
import type { Task } from "@/lib/companion/types";

interface ReminderPopupProps {
  task: Task | null;
  snoozeMinutes: number;
  onDone: (id: string) => void;
  onSnooze: (id: string) => void;
  onDismiss: () => void;
}

export function ReminderPopup({
  task,
  snoozeMinutes,
  onDone,
  onSnooze,
  onDismiss,
}: ReminderPopupProps) {
  if (!task) return null;

  return (
    <div className="animate-bubble-in fixed bottom-4 left-1/2 z-50 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2">
      <div className="soft-card rounded-3xl p-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/30">
            <AlarmClock className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{task.title}</p>
            <p className="text-xs font-semibold text-muted-foreground">
              {task.reminderAt ? formatReminder(task.reminderAt) : "now"} · time for this one!
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss reminder"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onDone(task.id)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-mint px-3 py-2 text-xs font-bold transition-transform hover:scale-[1.02]"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Done
          </button>
          <button
            type="button"
            onClick={() => onSnooze(task.id)}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground transition-transform hover:scale-[1.02]"
          >
            Snooze {snoozeMinutes}m
          </button>
        </div>
      </div>
    </div>
  );
}
