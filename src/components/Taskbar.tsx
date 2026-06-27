import { useEffect, useState } from "react";
import { Music, Power, Volume2 } from "lucide-react";
import type { useAudioPlayer } from "../hooks/useAudioPlayer";

interface TaskbarProps {
  player: ReturnType<typeof useAudioPlayer>;
  onOpenWindow: (id: string) => void;
  openWindows: { id: string; title: string }[];
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  onShutdown: () => void;
}

export function Taskbar({
  player,
  onOpenWindow,
  openWindows,
  startMenuOpen,
  setStartMenuOpen,
  onShutdown,
}: TaskbarProps) {
  const { isPlaying, track, volume, isMuted, toggleMute, setVolume, togglePlay } = player;
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", check);
    };
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const truncatedTitle = track.title.length > 12 ? track.title.slice(0, 12) + ".." : track.title;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bevel-out-dark bg-[#c0c0c0] flex items-center px-1 gap-0.5 h-9">
      <button onClick={() => setStartMenuOpen(!startMenuOpen)} className="win95-title px-2 h-7 flex items-center gap-1 sm:gap-2 font-pixel text-[8px] sm:text-[10px] text-[#f0f0f0] bevel-out-dark hover:brightness-110 flex-shrink-0">
        <img src="/1/pfp.png" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 pixelated hidden sm:inline" />
        <span>Start</span>
      </button>

      {!isMobile && <div className="flex-1 flex items-center gap-0.5 overflow-x-auto">
        {openWindows.map((w) => (
          <button key={w.id} onClick={() => onOpenWindow(w.id)} className="h-7 px-2 bevel-out-dark text-[10px] font-mono-y2k text-black flex items-center gap-1 max-w-[120px] truncate hover:bg-[#d0d0d0] flex-shrink-0">
            <span className="truncate">{w.title}</span>
          </button>
        ))}
      </div>}

      <div className="flex items-center gap-0.5 ml-auto">
        <button onClick={togglePlay} className="w-6 h-6 sm:w-7 sm:h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0] flex-shrink-0" title={isPlaying ? "Pause" : "Play"}><Music size={11} /></button>
        {!isMobile && isPlaying && <div className="h-6 bevel-out-dark px-1.5 flex items-center gap-1 max-w-[100px]"><span className="text-[9px] sm:text-[10px] font-mono-y2k text-black truncate">{truncatedTitle}</span></div>}
        {!isMobile && <><button onClick={toggleMute} className="w-6 h-6 sm:w-7 sm:h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0]" title="Mute"><Volume2 size={11} className={isMuted || volume === 0 ? "opacity-30" : ""} /></button>
        <div className="h-6 bevel-in w-16 sm:w-20 px-1 flex items-center"><input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full" title="Volume" /></div>
        <div className="h-6 bevel-out-dark px-1.5 flex items-center text-[8px] sm:text-[10px] font-pixel text-black flex-shrink-0">{player.currentIndex + 1}/{player.totalTracks}</div></>}
        <div className="h-6 bevel-out-dark px-1.5 flex items-center text-[10px] sm:text-[11px] font-mono-y2k text-black tabular-nums min-w-[36px] justify-center flex-shrink-0">{timeStr}</div>
        <button onClick={onShutdown} className="w-6 h-6 sm:w-7 sm:h-7 bevel-out-dark flex items-center justify-center hover:bg-[#d0d0d0] flex-shrink-0" title="Shut down"><Power size={11} /></button>
      </div>
    </div>
  );
}
