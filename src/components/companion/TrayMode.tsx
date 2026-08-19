import { Battery, CheckCircle2, Maximize2 } from "lucide-react";
import { Avatar } from "./Avatar";
import { formatClock } from "@/lib/companion/time";
import type { AvatarState, SpeechMessage } from "@/lib/companion/types";

interface TrayModeProps {
  now: Date | null;
  state: AvatarState;
  message: SpeechMessage | null;
  done: number;
  total: number;
  progress: number;
  onExpand: () => void;
}

export function TrayMode({ now, state, message, done, total, progress, onExpand }: TrayModeProps) {
  const clock = now ? formatClock(now, false) : null;

  return (
    <div className="animate-bubble-in w-[min(30rem,100%)]">
      {message && (
        <p className="mx-auto mb-2 w-fit max-w-full truncate rounded-2xl bg-card px-3 py-1.5 text-xs font-bold shadow-md">
          {message.text}
        </p>
      )}
      <div className="soft-card grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-full py-2 pl-2 pr-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-babyblue/50">
          <Avatar state={state} compact className="h-12 w-12" />
        </div>
        <div className="grid min-w-0 grid-cols-3 items-center gap-2 text-xs font-bold">
          <span className="truncate tabular-nums">
            {clock ? `${clock.time} ${clock.suffix}` : "--:--"}
          </span>
          <span className="inline-flex items-center gap-1 truncate">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {done}/{total}
          </span>
          <span className="inline-flex items-center gap-1 truncate">
            <Battery className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {progress}%
          </span>
        </div>
        <button
          type="button"
          onClick={onExpand}
          aria-label="Exit tray mode"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/25 transition-transform hover:scale-110"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
