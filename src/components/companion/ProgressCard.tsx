import { cn } from "@/lib/utils";

interface ProgressCardProps {
  done: number;
  total: number;
  progress: number;
  className?: string;
}

export function ProgressCard({ done, total, progress, className }: ProgressCardProps) {
  return (
    <div className={cn("soft-card rounded-3xl px-4 py-3", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="truncate text-sm font-bold">Daily progress</p>
        <p className="shrink-0 font-display text-sm font-bold tabular-nums text-muted-foreground">
          {done}/{total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Daily task progress"
        className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
