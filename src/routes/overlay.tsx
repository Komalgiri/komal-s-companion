import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import { Avatar } from "@/components/companion/Avatar";
import { SpeechBubble } from "@/components/companion/SpeechBubble";
import { PomodoroTimer } from "@/components/companion/PomodoroTimer";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useTasks } from "@/hooks/useTasks";
import { useClock } from "@/hooks/useClock";
import { useCompanion } from "@/hooks/useCompanion";
import { useSettings } from "@/hooks/useSettings";

import type { SpeechMessage } from "@/lib/companion/types";

export const Route = createFileRoute("/overlay")({
  component: OverlayComponent,
});

function OverlayComponent() {
  useEffect(() => {
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const { tasks, toggleTask, snoozeTask } = useTasks();
  const now = useClock();
  const { settings } = useSettings();
  
  const pomodoro = usePomodoro({ ...settings, syncMode: 'slave' } as any);
  
  const companion = useCompanion({ 
    now, 
    tasks, 
    settings, 
    remaining: tasks.filter(t => !t.done).length,
    isFocusing: pomodoro.phase === "focus" 
  });
  
  const [message, setMessage] = useState<SpeechMessage | null>(null);

  useEffect(() => {
    if (companion.dueTask) {
      setMessage({
        id: "overlay-msg",
        text: `It's time for "${companion.dueTask.title}"! Are you done?`,
        tone: "info",
        avatarState: "reminder"
      });
    } else {
      setMessage(null);
    }
  }, [companion.dueTask]);

  useEffect(() => {
    if ((companion.dueTask || pomodoro.isRunning) && window.electronAPI) {
      // Don't show inactive if we want to steal focus, but here we just show overlay
    } else if (!companion.dueTask && !pomodoro.isRunning && window.electronAPI) {
      window.electronAPI.hideOverlay();
    }
  }, [companion.dueTask, pomodoro.isRunning]);

  const handleDone = () => {
    if (companion.dueTask) {
      toggleTask(companion.dueTask.id);
      if (window.electronAPI) {
        window.electronAPI.taskCompleted();
      }
    }
  };

  const handleNotYet = () => {
    if (companion.dueTask) {
      snoozeTask(companion.dueTask.id, settings.snoozeMinutes);
      if (window.electronAPI) {
        window.electronAPI.taskSnoozed();
      }
    }
  };

  // The entire window is transparent, main has drag
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-end overflow-hidden bg-transparent pb-4" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex flex-col items-center gap-4">
        {message && (
          <div style={{ WebkitAppRegion: 'no-drag' } as any} className="relative">
            <SpeechBubble
              message={message}
              onDismiss={handleNotYet}
            />
            <div className="mt-2 flex justify-center gap-2">
              <button 
                onClick={handleDone}
                className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-sm hover:scale-105"
              >
                Done!
              </button>
              <button 
                onClick={handleNotYet}
                className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground shadow-sm hover:scale-105"
              >
                Not yet
              </button>
            </div>
          </div>
        )}
        
        {pomodoro.phase !== "idle" && !companion.dueTask && (
          <div style={{ WebkitAppRegion: 'no-drag' } as any} className="soft-card rounded-3xl px-3 py-2 w-36 mb-2">
            <PomodoroTimer
              compact
              phase={pomodoro.phase}
              isRunning={pomodoro.isRunning}
              timeLeft={pomodoro.timeLeft}
              sessionCount={pomodoro.sessionCount}
              onToggle={pomodoro.toggleTimer}
              onStop={pomodoro.stopTimer}
              onSkip={pomodoro.skipPhase}
            />
          </div>
        )}

        <div className="relative group cursor-move">
          <Avatar state={companion.avatarState} className="h-32 w-32" />
          <button 
            onClick={() => window.electronAPI?.restoreMainWindow()}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className="absolute top-0 right-0 p-1.5 bg-card text-card-foreground shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
            aria-label="Restore main window"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
