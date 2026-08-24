import type { SpeechMessage, Task } from "./types";

let counter = 0;
export const makeMessage = (
  text: string,
  tone: SpeechMessage["tone"],
  avatarState: SpeechMessage["avatarState"],
): SpeechMessage => ({ id: `msg-${++counter}-${Date.now()}`, text, tone, avatarState });

export function greeting(name: string, hour: number): SpeechMessage {
  if (hour < 5) return makeMessage(`Still up, ${name}? 🌙`, "calm", "sleeping");
  if (hour < 12) return makeMessage(`Good morning, ${name}! ☀️`, "cheer", "happy");
  if (hour < 17) return makeMessage(`Afternoon check-in, ${name} ✨`, "info", "idle");
  if (hour < 21) return makeMessage(`Evening, ${name}. Let's wrap up nicely.`, "info", "idle");
  return makeMessage("It's getting late. Time to wind down. 🌙", "calm", "sleeping");
}

export function weatherGreeting(name: string, hour: number, weather: import("@/hooks/useWeather").WeatherData | null): SpeechMessage {
  if (!weather) return greeting(name, hour);

  // Night time overrides weather
  if (hour < 5 || hour >= 21) return greeting(name, hour);
  
  const timeOfDay = hour < 12 ? "Good morning" : "Good afternoon";

  if (weather.condition === "rain") {
    return makeMessage(`Looks like rain outside! Stay cozy, ${name}. 🌧️`, "info", "thinking");
  }
  if (weather.condition === "snow") {
    return makeMessage(`It's snowing! Hope you have a warm drink, ${name}. ❄️`, "cheer", "happy");
  }
  if (weather.condition === "storm") {
    return makeMessage(`Stormy weather outside! Stay safe, ${name}. ⚡`, "warn", "thinking");
  }
  if (weather.isCold) {
    return makeMessage(`It's pretty cold out there! Bundle up, ${name}. 🧣`, "info", "idle");
  }
  if (weather.isHot) {
    return makeMessage(`It's quite hot today! Stay hydrated, ${name}. 🥤`, "warn", "happy");
  }
  if (weather.condition === "sunny") {
    return makeMessage(`${timeOfDay}! It's a beautiful sunny day, ${name}. ☀️`, "cheer", "happy");
  }
  if (weather.condition === "fog") {
    return makeMessage(`${timeOfDay}, ${name}. It's a bit foggy outside! 🌫️`, "info", "idle");
  }

  // Fallback if it's just cloudy or unknown but not extreme temps
  return greeting(name, hour);
}

export function remainingMessage(count: number): SpeechMessage {
  if (count === 0) return makeMessage("All done for today! 🎉", "cheer", "celebration");
  return makeMessage(
    `You have ${count} task${count === 1 ? "" : "s"} left today.`,
    "info",
    "reminder",
  );
}

export const completedMessage = () =>
  makeMessage("Nice! One more done. 💚", "cheer", "taskDone");

export const breakMessage = () =>
  makeMessage("Need a break? Stretch and grab some water ☕", "calm", "thinking");

export function staleMessage(task: Task, days: number): SpeechMessage {
  return makeMessage(
    `"${task.title}" has been pending for ${days} day${days === 1 ? "" : "s"} 👀`,
    "warn",
    "sad",
  );
}

export const reminderMessage = (task: Task) =>
  makeMessage(`Reminder: ${task.title} ⏰`, "warn", "reminder");

export const snoozeMessage = (minutes: number) =>
  makeMessage(`Okay, I'll nudge you again in ${minutes} min 😴`, "calm", "idle");

export const habitMessage = (habitTitle: string) =>
  makeMessage(`Time to: ${habitTitle} ✨`, "info", "happy");
