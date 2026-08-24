import { useState, useEffect, useCallback, useRef } from "react";

export type PomodoroPhase = "idle" | "focus" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  syncMode?: 'master' | 'slave';
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  syncMode: 'master',
};

const POMODORO_STORAGE_KEY = "tinykomal_pomodoro_state";

export function usePomodoro(settings: PomodoroSettings = DEFAULT_SETTINGS) {
  const [phase, setPhase] = useState<PomodoroPhase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [sessionCount, setSessionCount] = useState(0);

  // Sync to local storage if master
  useEffect(() => {
    if (settings.syncMode === 'master') {
      localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify({
        phase, isRunning, timeLeft, sessionCount
      }));
    }
  }, [phase, isRunning, timeLeft, sessionCount, settings.syncMode]);

  // Read from local storage if slave
  useEffect(() => {
    if (settings.syncMode !== 'slave') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === POMODORO_STORAGE_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          setPhase(data.phase);
          setIsRunning(data.isRunning);
          setTimeLeft(data.timeLeft);
          setSessionCount(data.sessionCount);
        } catch (err) {}
      }
    };
    
    // Initial load
    const initial = localStorage.getItem(POMODORO_STORAGE_KEY);
    if (initial) {
      try {
        const data = JSON.parse(initial);
        setPhase(data.phase);
        setIsRunning(data.isRunning);
        setTimeLeft(data.timeLeft);
        setSessionCount(data.sessionCount);
      } catch (err) {}
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [settings.syncMode]);

  // Keep settings ref to avoid trigger intervals on settings change
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // When returning to idle, reset time
  useEffect(() => {
    if (phase === "idle") {
      setTimeLeft(settings.focusMinutes * 60);
    }
  }, [settings.focusMinutes, phase]);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        // Timer ended
        setPhase((currentPhase) => {
          if (currentPhase === "focus") {
            const newCount = sessionCount + 1;
            setSessionCount(newCount);
            if (newCount % settingsRef.current.sessionsBeforeLongBreak === 0) {
              setTimeLeft(settingsRef.current.longBreakMinutes * 60);
              return "longBreak";
            } else {
              setTimeLeft(settingsRef.current.shortBreakMinutes * 60);
              return "shortBreak";
            }
          } else if (currentPhase === "shortBreak" || currentPhase === "longBreak") {
            setTimeLeft(settingsRef.current.focusMinutes * 60);
            setIsRunning(false);
            return "idle";
          }
          return "idle";
        });
        return 0;
      }
      return prev - 1;
    });
  }, [sessionCount]);

  useEffect(() => {
    if (!isRunning || settings.syncMode === 'slave') return;
    
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick, settings.syncMode]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => {
      if (!prev && phase === "idle") {
        setPhase("focus");
      }
      return !prev;
    });
  }, [phase]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setPhase("idle");
    setTimeLeft(settingsRef.current.focusMinutes * 60);
  }, []);
  
  const skipPhase = useCallback(() => {
      // Force timer to end
      setTimeLeft(0);
      tick();
  }, [tick]);

  return {
    phase,
    isRunning,
    timeLeft,
    sessionCount,
    toggleTimer,
    stopTimer,
    skipPhase
  };
}
