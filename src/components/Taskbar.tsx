import { useEffect, useState } from "react";
import { Music, Power, Volume2 } from "lucide-react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface TaskbarProps {
  player: ReturnType<typeof useAudioPlayer>;
  onOpenWindow: (id: string) => void;
  openWindows: { id: string; title: string }[];
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  onShutdown: () => void;
}

export function Taskbar({ player, onOpenWindow, openWindows, startMenuOpen, setStartMenuOpen, onShutdown }: TaskbarProps) {
  const { isPlaying, track, currentIndex, totalTracks, volume, isMuted, toggleMute, setVolume, togglePlay } = player;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] h-9 bevel-out-dark bg-[#c0c0c0] flex items-center px-1 gap-1">
      <button
        onClick={() => setStartMenuOpen(!startMenuOpen)}
        className="win95-title px-3 h-7 flex items-center gap-2 font-pixel text-[10px] text-[#f0f0f0] bevel-out-dark hover:brightness-110"
      >
        <img src="/1/pfp.png" alt="" className="w-4 h-4 pixelated" />
        <span>Start</span>
      </button>

      <div className="h-6 w-px bg-[#5a5a5a] mx-1" />

      {openWindows.length > 0 && (
        <>
          {openWindows.map((w) => (
            <button
              key={w.id}
              onClick={() => onOpenWindow(w.id)}
              className="h-7 px-2 bevel-out-dark text-[10px] font-mono-y2k text-black flex items-center gap-1.5 max-w-[160px] truncate hover:bg-[#d0d0d0]"
            >
              <span className="truncate">{w.title}</span>
            </button>
          ))}
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={togglePlay}
          className="w-7 h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0]"
          title={isPlaying ? "Pause" : "Play"}
        >
          <Music size={12} />
        </button>
        <div className="h-7 bevel-out-dark px-2 flex items-center gap-1.5 min-w-[100px]">
          <span className="text-[10px] font-mono-y2k text-black truncate max-w-[80px]">
            {isPlaying ? track.title : "—"}
          </span>
        </div>
        <button
          onClick={toggleMute}
          className="w-7 h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0]"
          title="Mute"
        >
          <Volume2 size={12} className={isMuted || volume === 0 ? "opacity-30" : ""} />
        </button>
        <div className="h-7 bevel-in w-20 px-1 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="h-7 bevel-out-dark px-2 flex items-center text-[10px] font-pixel text-black">
          {currentIndex + 1}/{totalTracks}
        </div>
        <div className="h-7 bevel-out-dark px-2 flex items-center text-[11px] font-mono-y2k text-black tabular-nums min-w-[44px] justify-center">
          {timeStr}
        </div>
        <button
          onClick={onShutdown}
          className="w-7 h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0]"
          title="Shut down"
        >
          <Power size={12} />
        </button>
      </div>
    </div>
  );
}
