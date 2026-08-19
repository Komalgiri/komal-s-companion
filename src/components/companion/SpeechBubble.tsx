import { cn } from "@/lib/utils";
import type { SpeechMessage } from "@/lib/companion/types";

const TONE: Record<SpeechMessage["tone"], string> = {
  info: "bg-babyblue/70 text-foreground",
  cheer: "bg-mint/70 text-foreground",
  warn: "bg-cream/80 text-foreground",
  calm: "bg-lavender/70 text-foreground",
};

interface SpeechBubbleProps {
  message: SpeechMessage | null;
  className?: string;
  onDismiss?: () => void;
}

export function SpeechBubble({ message, className, onDismiss }: SpeechBubbleProps) {
  if (!message) return null;

  return (
    <div
      key={message.id}
      role="status"
      aria-live="polite"
      className={cn("animate-bubble-in relative max-w-[19rem]", className)}
    >
      <button
        type="button"
        onClick={onDismiss}
        className={cn(
          "block rounded-3xl px-4 py-3 text-left text-sm font-semibold leading-snug shadow-md transition-transform hover:scale-[1.02]",
          TONE[message.tone],
        )}
      >
        {message.text}
      </button>
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-1.5 left-8 h-4 w-4 rotate-45 rounded-[4px]",
          TONE[message.tone],
        )}
      />
    </div>
  );
}
