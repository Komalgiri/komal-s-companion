import { Play, Pause, Square, SkipForward } from "lucide-react";
import { PomodoroPhase } from "@/hooks/usePomodoro";

interface PomodoroTimerProps {
  phase: PomodoroPhase;
  isRunning: boolean;
  timeLeft: number;
  sessionCount: number;
  onToggle: () => void;
  onStop: () => void;
  onSkip: () => void;
  compact?: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer({
  phase,
  isRunning,
  timeLeft,
  sessionCount,
  onToggle,
  onStop,
  onSkip,
  compact = false,
}: PomodoroTimerProps) {
  
  const getPhaseLabel = () => {
    switch (phase) {
      case "idle": return "Ready to Focus";
      case "focus": return "Focus Mode";
      case "shortBreak": return "Short Break";
      case "longBreak": return "Long Break";
    }
  };

  return (
    <div className={`group relative flex flex-col items-center justify-center ${compact ? '' : 'gap-2'} px-2`}>
      <div className={`flex w-full items-center justify-between ${compact ? 'px-0' : 'px-1'}`}>
        <span className={`font-medium uppercase tracking-wider text-muted-foreground ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {getPhaseLabel()}
        </span>
        {sessionCount > 0 && !compact && (
          <span className="text-xs text-muted-foreground">
            Session {sessionCount}
          </span>
        )}
      </div>
      
      <div className={`font-display font-bold tracking-tight ${compact ? 'text-3xl' : 'text-4xl'}`}>
        {formatTime(timeLeft)}
      </div>

      <div className={`flex items-center ${compact ? 'absolute -bottom-8 left-1/2 -translate-x-1/2 gap-1 opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300 bg-background/95 backdrop-blur-sm p-1.5 rounded-full shadow-md z-10' : 'gap-2 mt-2'}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
          className={`grid place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 ${compact ? 'h-7 w-7' : 'h-10 w-10'}`}
        >
          {isRunning ? <Pause className={compact ? 'h-3.5 w-3.5' : 'h-5 w-5'} /> : <Play className={`${compact ? 'h-3.5 w-3.5 ml-0.5' : 'h-5 w-5 ml-1'}`} />}
        </button>

        {phase !== "idle" && (
          <>
            <button
              type="button"
              onClick={onSkip}
              aria-label="Skip phase"
              className={`grid place-items-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-105 active:scale-95 ${compact ? 'h-7 w-7' : 'h-10 w-10'}`}
            >
              <SkipForward className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
            </button>

            <button
              type="button"
              onClick={onStop}
              aria-label="Stop timer"
              className={`grid place-items-center rounded-full bg-destructive/10 text-destructive transition-transform hover:scale-105 active:scale-95 ${compact ? 'h-7 w-7' : 'h-10 w-10'}`}
            >
              <Square className={compact ? 'h-3 w-3' : 'h-4 w-4'} fill="currentColor" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
