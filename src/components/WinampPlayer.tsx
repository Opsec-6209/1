import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function Spectrum({ audioElement, isPlaying }: { audioElement: HTMLAudioElement; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;

    const ensure = () => {
      if (cancelled) return;
      try {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        if (!analyserRef.current) {
          const a = ctxRef.current.createAnalyser();
          a.fftSize = 64;
          analyserRef.current = a;
          dataRef.current = new Uint8Array(a.frequencyBinCount);
          ctxRef.current.createMediaElementSource(audioElement).connect(a);
          a.connect(ctxRef.current.destination);
        }
      } catch {}
    };

    if (isPlaying) ensure();

    const draw = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const a = analyserRef.current;
      const d = dataRef.current;
      if (a && d && isPlaying) {
        a.getByteFrequencyData(d as Uint8Array<ArrayBuffer>);
        const bars = 20;
        const gap = 2;
        const w = (canvas.width - (bars - 1) * gap) / bars;
        for (let i = 0; i < bars; i++) {
          const v = d[i] ?? 0;
          const h = Math.max(2, (v / 255) * canvas.height);
          const x = i * (w + gap);
          const y = canvas.height - h;
          ctx.fillStyle = "#f0f0f0";
          ctx.fillRect(x, y, w, h);
        }
      } else {
        for (let i = 0; i < 20; i++) {
          const x = i * ((canvas.width - 19 * 2) / 20 + 2);
          ctx.fillStyle = "rgba(240,240,240,0.15)";
          ctx.fillRect(x, canvas.height - 4, (canvas.width - 19 * 2) / 20, 4);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [audioElement, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={40}
      className="pixelated"
      style={{ imageRendering: "pixelated", width: "160px", height: "40px" }}
    />
  );
}

interface WinampPlayerProps {
  player: ReturnType<typeof useAudioPlayer>;
}

export function WinampPlayer({ player }: WinampPlayerProps) {
  const {
    audio,
    track,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    shuffle,
    repeat,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = player;

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isDraggingP, setIsDraggingP] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const updateProgress = (clientX: number) => {
    if (!progressRef.current || duration <= 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seek(pct * duration);
  };
  const updateVolume = (clientX: number) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(pct);
  };

  return (
    <div className="bevel-out-dark bg-[#232323] p-2 font-mono-y2k text-[#f0f0f0]">
      <div className="flex items-center gap-2 mb-2">
        <div className="font-pixel text-[9px] text-[#f0f0f0]">WINAMP</div>
        <div className="text-[10px] truncate flex-1">
          {track.title} <span className="text-[#707070]">— {track.artist}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bevel-in p-1 bg-black">
          <Spectrum audioElement={audio} isPlaying={isPlaying} />
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tabular-nums w-10">{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDraggingP(true);
                updateProgress(e.clientX);
              }}
              onPointerMove={(e) => {
                if (progressRef.current && duration > 0) {
                  const rect = progressRef.current.getBoundingClientRect();
                  setHoverPct(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                }
                if (isDraggingP) updateProgress(e.clientX);
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setIsDraggingP(false);
              }}
              onPointerLeave={() => setHoverPct(null)}
              className="relative flex-1 h-4 flex items-center cursor-pointer touch-none"
            >
              <div className="w-full h-2 bevel-in bg-[#0a0a0a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5a5a5a] to-[#f0f0f0]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-[#f0f0f0] border border-[#0a0a0a] pointer-events-none"
                style={{ left: `calc(${progress}% - 4px)` }}
              />
              {hoverPct !== null && duration > 0 && (
                <div
                  className="absolute -top-5 px-1 text-[9px] bg-[#f0f0f0] text-black border border-[#0a0a0a] pointer-events-none font-pixel"
                  style={{ left: `calc(${hoverPct * 100}% - 16px)` }}
                >
                  {formatTime(hoverPct * duration)}
                </div>
              )}
            </div>
            <span className="text-[10px] tabular-nums w-10 text-right">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleShuffle}
              className={`w-6 h-6 bevel-out-dark text-[10px] font-pixel flex items-center justify-center ${
                shuffle ? "bg-[#5a5a5a] text-white" : ""
              }`}
              title="Shuffle"
            >
              SH
            </button>
            <button
              onClick={prev}
              className="w-6 h-6 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]"
              title="Previous"
            >
              <SkipBack size={11} />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-7 bevel-out-dark flex items-center justify-center bg-[#1c1c1c] hover:bg-[#2a2a2a]"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={next}
              className="w-6 h-6 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]"
              title="Next"
            >
              <SkipForward size={11} />
            </button>
            <button
              onClick={cycleRepeat}
              className={`w-6 h-6 bevel-out-dark text-[10px] font-pixel flex items-center justify-center ${
                repeat !== "off" ? "bg-[#5a5a5a] text-white" : ""
              }`}
              title={`Repeat: ${repeat}`}
            >
              {repeat === "one" ? "R1" : "RP"}
            </button>
            <button
              onClick={toggleMute}
              className="w-6 h-6 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]"
              title="Mute"
            >
              {isMuted || volume === 0 ? <VolumeX size={11} /> : <Volume2 size={11} />}
            </button>
            <div
              ref={volumeRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDraggingV(true);
                updateVolume(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isDraggingV) updateVolume(e.clientX);
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setIsDraggingV(false);
              }}
              className="relative flex-1 h-3 flex items-center cursor-pointer touch-none"
            >
              <div className="w-full h-1.5 bevel-in bg-[#0a0a0a] overflow-hidden">
                <div
                  className="h-full bg-[#f0f0f0]"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                />
              </div>
              <div
                className="absolute w-1.5 h-3 bg-[#f0f0f0] border border-[#0a0a0a] pointer-events-none"
                style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 3px)` }}
              />
            </div>
            <span className="text-[10px] tabular-nums w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
