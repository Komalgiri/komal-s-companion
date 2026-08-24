import { useState, useEffect } from "react";

export type WeatherCondition = "sunny" | "cloudy" | "rain" | "snow" | "fog" | "storm" | "unknown";

export interface WeatherData {
  city: string;
  temperature: number; // Celsius
  condition: WeatherCondition;
  isCold: boolean;
  isHot: boolean;
}

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "unknown";
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // 1. Get approximate location via IP
        const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
        if (!geoRes.ok) throw new Error("Failed to fetch location");
        const geoData = await geoRes.json();
        
        const lat = geoData.latitude;
        const lon = geoData.longitude;
        const city = geoData.city || "your area";

        // 2. Fetch current weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!weatherRes.ok) throw new Error("Failed to fetch weather");
        const weatherData = await weatherRes.json();

        const current = weatherData.current_weather;
        
        setWeather({
          city,
          temperature: current.temperature,
          condition: getWeatherCondition(current.weathercode),
          isCold: current.temperature < 10,
          isHot: current.temperature > 28,
        });
      } catch (err: any) {
        console.error("Weather fetch error:", err);
        setError(err.message || "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return { weather, loading, error };
}
