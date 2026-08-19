import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { AvatarState } from "@/lib/companion/types";
import idleSrc from "@/assets/avatar-idle.png";
import happySrc from "@/assets/avatar-happy.png";
import thinkingSrc from "@/assets/avatar-thinking.png";
import sleepingSrc from "@/assets/avatar-sleeping.png";
import walkingSrc from "@/assets/avatar-walking.png";
import reminderSrc from "@/assets/avatar-reminder.png";

/**
 * Avatar asset slots. Each state maps to its own image so real per-state PNG
 * sprites (or sprite sheets, later) can be dropped in without touching UI code.
 */
export const AVATAR_ASSETS: Record<AvatarState, string> = {
  idle: idleSrc,
  walking: walkingSrc,
  happy: happySrc,
  thinking: thinkingSrc,
  reminder: reminderSrc,
  taskDone: happySrc,
  sad: thinkingSrc,
  sleeping: sleepingSrc,
  celebration: happySrc,
};

const MOTION: Record<AvatarState, string> = {
  idle: "animate-float",
  walking: "animate-bob",
  happy: "animate-bob",
  thinking: "animate-sway",
  reminder: "animate-bob",
  taskDone: "animate-pop",
  sad: "animate-sway",
  sleeping: "animate-float",
  celebration: "animate-bob",
};

const CONFETTI = ["bg-primary", "bg-lavender", "bg-babyblue", "bg-mint", "bg-cream"];

interface AvatarProps {
  state: AvatarState;
  className?: string;
  /** Compact rendering for the tray mode. */
  compact?: boolean;
}

export function Avatar({ state, className, compact = false }: AvatarProps) {
  const [visible, setVisible] = useState(state);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (state === visible) return;
    setFading(true);
    const id = window.setTimeout(() => {
      setVisible(state);
      setFading(false);
    }, 160);
    return () => window.clearTimeout(id);
  }, [state, visible]);

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <div
        aria-hidden
        className="avatar-halo pointer-events-none absolute bottom-4 left-1/2 h-2/3 w-4/5 -translate-x-1/2 opacity-70 blur-xl"
      />

      {state === "celebration" && !compact && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "absolute top-0 h-2 w-1.5 rounded-full animate-confetti",
                CONFETTI[i % CONFETTI.length],
              )}
              style={{ left: `${6 + i * 6.5}%`, animationDelay: `${(i % 7) * 0.12}s` }}
            />
          ))}
        </div>
      )}

      <img
        src={AVATAR_ASSETS[visible]}
        alt={`Tiny Komal — ${visible} state`}
        width={768}
        height={1024}
        className={cn(
          "relative h-full w-auto max-w-full object-contain drop-shadow-xl transition-all duration-200 ease-out",
          MOTION[visible],
          fading ? "scale-95 opacity-0" : "scale-100 opacity-100",
        )}
      />
    </div>
  );
}
