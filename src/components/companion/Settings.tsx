import { X } from "lucide-react";
import type { CompanionSettings } from "@/lib/companion/types";

interface SettingsProps {
  open: boolean;
  settings: CompanionSettings;
  onUpdate: <K extends keyof CompanionSettings>(key: K, value: CompanionSettings[K]) => void;
  onClose: () => void;
  onClearCompleted: () => void;
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{label}</p>
        {hint && <p className="truncate text-xs font-semibold text-muted-foreground">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-card shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

const selectClass =
  "rounded-xl bg-muted px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-ring";

export function Settings({ open, settings, onUpdate, onClose, onClearCompleted }: SettingsProps) {
  if (!open) return null;

  return (
    <div className="animate-bubble-in absolute inset-x-3 bottom-3 top-3 z-40 overflow-y-auto rounded-3xl bg-card/95 p-4 backdrop-blur-md">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-base font-bold">Reminder settings</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-2 divide-y divide-border">
        <Row label="Your name" hint="Used in greetings">
          <input
            value={settings.userName}
            onChange={(e) => onUpdate("userName", e.target.value)}
            aria-label="Your name"
            className="w-28 rounded-xl bg-muted px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-ring"
          />
        </Row>
        <Row label="Reminders" hint="Nudge me at task times">
          <Toggle
            label="Enable reminders"
            checked={settings.remindersEnabled}
            onChange={(v) => onUpdate("remindersEnabled", v)}
          />
        </Row>
        <Row label="Snooze length">
          <select
            value={settings.snoozeMinutes}
            onChange={(e) => onUpdate("snoozeMinutes", Number(e.target.value))}
            aria-label="Snooze length"
            className={selectClass}
          >
            {[5, 10, 15, 30].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </Row>
        <Row label="Break nudges" hint="How often Komal suggests a break">
          <select
            value={settings.breakIntervalMinutes}
            onChange={(e) => onUpdate("breakIntervalMinutes", Number(e.target.value))}
            aria-label="Break nudge interval"
            className={selectClass}
          >
            {[0, 25, 45, 60, 90].map((m) => (
              <option key={m} value={m}>
                {m === 0 ? "Off" : `${m} min`}
              </option>
            ))}
          </select>
        </Row>
        <Row label="Wind-down hour" hint="When the evening message appears">
          <select
            value={settings.windDownHour}
            onChange={(e) => onUpdate("windDownHour", Number(e.target.value))}
            aria-label="Wind down hour"
            className={selectClass}
          >
            {[20, 21, 22, 23].map((h) => (
              <option key={h} value={h}>
                {h}:00
              </option>
            ))}
          </select>
        </Row>
        <Row label="Sound" hint="Play a chime with reminders">
          <Toggle
            label="Enable sound"
            checked={settings.soundEnabled}
            onChange={(v) => onUpdate("soundEnabled", v)}
          />
        </Row>
        <Row label="Completed tasks" hint="Clear everything already done">
          <button
            type="button"
            onClick={onClearCompleted}
            className="rounded-xl bg-destructive/15 px-3 py-1.5 text-xs font-bold text-destructive"
          >
            Clear
          </button>
        </Row>
      </div>
    </div>
  );
}
