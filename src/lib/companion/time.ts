export function formatClock(date: Date, withSeconds = true) {
  const h24 = date.getHours();
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return {
    time: withSeconds ? `${h}:${m}:${s}` : `${h}:${m}`,
    suffix: h24 < 12 ? "AM" : "PM",
  };
}

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

/** "HH:mm" -> friendly "9:30 AM" */
export function formatReminder(value: string) {
  const [hStr, mStr] = value.split(":");
  const h24 = Number(hStr);
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${mStr} ${h24 < 12 ? "AM" : "PM"}`;
}

export const minutesSinceMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes();

export const parseReminderMinutes = (value: string) => {
  const [h = 0, m = 0] = value.split(":").map(Number);
  return h * 60 + m;
};

export const daysBetween = (from: number, to: number) =>
  Math.floor((to - from) / (24 * 60 * 60 * 1000));
