import { formatClock, formatLongDate } from "@/lib/companion/time";
import { cn } from "@/lib/utils";

interface ClockProps {
  now: Date | null;
  remaining: number;
  className?: string;
}

export function Clock({ now, remaining, className }: ClockProps) {
  const clock = now ? formatClock(now) : null;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-bold tabular-nums tracking-tight">
            {clock ? clock.time : "--:--:--"}
          </span>
          <span className="text-xs font-bold text-muted-foreground">{clock?.suffix ?? ""}</span>
        </div>
        <p className="truncate text-xs font-semibold text-muted-foreground">
          {now ? formatLongDate(now) : "\u00a0"}
        </p>
      </div>
      <div className="shrink-0 rounded-2xl bg-primary/25 px-3 py-2 text-center">
        <p className="font-display text-xl font-bold leading-none">{remaining}</p>
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">
          left
        </p>
      </div>
    </div>
  );
}
