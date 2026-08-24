import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/companion/Avatar";
import { SpeechBubble } from "@/components/companion/SpeechBubble";
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
  const companion = useCompanion({ now, tasks, settings, remaining: tasks.filter(t => !t.done).length });
  
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
      if (window.electronAPI) {
        window.electronAPI.hideOverlay();
      }
    }
  }, [companion.dueTask]);

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

  // The entire window is transparent, we only render the avatar and bubble
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-end overflow-hidden bg-transparent pb-4" style={{ WebkitAppRegion: 'drag' } as any}>
      <div style={{ WebkitAppRegion: 'no-drag' } as any} className="flex flex-col items-center gap-4">
        {message && (
          <div className="relative">
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
        <Avatar state={companion.avatarState} className="h-48 w-48" />
      </div>
    </main>
  );
}
