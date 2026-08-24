import { Play, Pause, Volume2, VolumeX, Disc3, Music } from "lucide-react";
import { useLofi } from "@/hooks/useLofi";
import { Slider } from "@/components/ui/slider";

export function LofiPlayer() {
  const { isPlaying, volume, setVolume, togglePlay } = useLofi();

  return (
    <div className="flex items-center gap-3 rounded-full bg-card/90 p-2 pr-4 shadow-md backdrop-blur-md border border-border">
      <button
        onClick={togglePlay}
        className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform shrink-0"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex flex-col gap-1 w-24">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Music className="w-3 h-3" />
            Lofi Radio
          </span>
          {isPlaying && (
            <Disc3 className="h-3 w-3 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {volume === 0 ? (
            <VolumeX className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => { if (v !== undefined) setVolume(v / 100) }}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
