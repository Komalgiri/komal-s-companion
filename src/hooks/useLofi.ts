import { useState, useEffect, useRef, useCallback } from "react";

// A public, reliable Lofi 24/7 internet radio stream
const STREAM_URL = "https://lofi.stream.laut.fm/lofi?t=";

export function useLofi() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element once
    // Adding timestamp to avoid aggressive caching issues with streams
    const audio = new Audio(`${STREAM_URL}${Date.now()}`);
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return {
    isPlaying,
    volume,
    setVolume,
    togglePlay,
  };
}
