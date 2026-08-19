import { useCallback, useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/companion/storage";
import { DEFAULT_SETTINGS, type CompanionSettings } from "@/lib/companion/types";

export function useSettings() {
  const [settings, setSettings] = useState<CompanionSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSettings(settings);
  }, [settings, hydrated]);

  const update = useCallback(<K extends keyof CompanionSettings>(key: K, value: CompanionSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { settings, update };
}
