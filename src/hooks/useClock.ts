import { useEffect, useState } from "react";

/** Ticking clock that only starts after hydration to avoid SSR mismatches. */
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
