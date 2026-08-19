import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minimize2, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { Avatar } from "@/components/companion/Avatar";
import { Clock } from "@/components/companion/Clock";
import { ProgressCard } from "@/components/companion/ProgressCard";
import { ReminderPopup } from "@/components/companion/ReminderPopup";
import { Settings } from "@/components/companion/Settings";
import { SpeechBubble } from "@/components/companion/SpeechBubble";
import { StatsRow } from "@/components/companion/StatsRow";
import { TodoList } from "@/components/companion/TodoList";
import { TrayMode } from "@/components/companion/TrayMode";
import { useClock } from "@/hooks/useClock";
import { useCompanion } from "@/hooks/useCompanion";
import { useSettings } from "@/hooks/useSettings";
import { useTasks } from "@/hooks/useTasks";
import { daysBetween } from "@/lib/companion/time";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tiny Komal — Your Cute Desktop Productivity Companion" },
      {
        name: "description",
        content:
          "Tiny Komal is a cute animated desktop companion that keeps your tasks, reminders and daily progress in one soft pastel panel.",
      },
      { property: "og:title", content: "Tiny Komal — Cute Desktop Productivity Companion" },
      {
        property: "og:description",
        content:
          "A tiny animated avatar that tracks your todos, reminders, breaks and daily progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TinyKomal,
});

function TinyKomal() {
  const now = useClock();
  const { settings, update } = useSettings();
  const {
    tasks,
    stats,
    addTask,
    toggleTask,
    removeTask,
    snoozeTask,
    clearCompleted,
  } = useTasks();
  const companion = useCompanion({ now, tasks, settings, remaining: stats.remaining });
  const [trayMode, setTrayMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleToggle = (id: string) => {
    const becameDone = toggleTask(id);
    companion.announceCompletion(becameDone, stats.remaining - 1);
  };

  const handleSnooze = (id: string) => {
    snoozeTask(id, settings.snoozeMinutes);
    companion.announceSnooze(settings.snoozeMinutes);
    companion.clearDueTask();
  };

  const handleReminderDone = (id: string) => {
    handleToggle(id);
    companion.clearDueTask();
  };

  const oldestDays = stats.oldestPendingAt ? daysBetween(stats.oldestPendingAt, Date.now()) : 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <h1 className="sr-only">Tiny Komal — desktop productivity companion</h1>

      {trayMode ? (
        <TrayMode
          now={now}
          state={companion.avatarState}
          message={companion.message}
          done={stats.done}
          total={stats.total}
          progress={stats.progress}
          onExpand={() => setTrayMode(false)}
        />
      ) : (
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)] lg:items-stretch">
          {/* Companion panel — 3:4 portrait */}
          <section className="panel-surface relative mx-auto aspect-[3/4] w-full max-w-[26rem] overflow-hidden rounded-[2.5rem] p-4">
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-card/70">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="truncate font-display text-sm font-bold">Tiny Komal</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((v) => !v)}
                  aria-label="Open settings"
                  className="grid h-8 w-8 place-items-center rounded-full bg-card/70 transition-transform hover:scale-110"
                >
                  <SettingsIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTrayMode(true)}
                  aria-label="Switch to tray mode"
                  className="grid h-8 w-8 place-items-center rounded-full bg-card/70 transition-transform hover:scale-110"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </header>

            <SpeechBubble
              message={companion.message}
              onDismiss={() => companion.setMessage(null)}
              className="mt-3"
            />

            <Avatar
              state={companion.avatarState}
              className="absolute inset-x-4 bottom-20 top-1/3"
            />

            <div className="absolute inset-x-4 bottom-4">
              <div className="soft-card rounded-3xl px-4 py-3">
                <Clock now={now} remaining={stats.remaining} />
              </div>
            </div>

            <Settings
              open={settingsOpen}
              settings={settings}
              onUpdate={update}
              onClose={() => setSettingsOpen(false)}
              onClearCompleted={clearCompleted}
            />
          </section>

          {/* Task side */}
          <section className="flex flex-col gap-3">
            <ProgressCard done={stats.done} total={stats.total} progress={stats.progress} />
            <StatsRow
              items={[
                { label: "Done", value: String(stats.done) },
                { label: "Reminders", value: String(stats.withReminders) },
                { label: "Oldest", value: `${oldestDays}d` },
              ]}
            />
            <TodoList
              tasks={tasks}
              onAdd={addTask}
              onToggle={handleToggle}
              onRemove={removeTask}
              onSnooze={handleSnooze}
              className="min-h-[22rem] flex-1"
            />
          </section>
        </div>
      )}

      <ReminderPopup
        task={companion.dueTask}
        snoozeMinutes={settings.snoozeMinutes}
        onDone={handleReminderDone}
        onSnooze={handleSnooze}
        onDismiss={companion.clearDueTask}
      />
    </main>
  );
}
