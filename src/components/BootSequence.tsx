import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "Phoenix BIOS v4.0 Release 6.0",
  "Copyright (C) 2006 opsec Systems",
  "",
  "CPU: opsec_6209 @ 4.20GHz",
  "Memory Test: 65536K OK",
  "",
  "Detecting Primary Master ... opsec_SSD",
  "Detecting Primary Slave  ... None",
  "Detecting Secondary Master ... CD-ROM",
  "",
  "Initializing Plug and Play...",
  "Loading Windows 98...",
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<"bios" | "win" | "done">("bios");
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSkip(true), 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "bios") return;
    if (lineIndex >= BOOT_LINES.length) {
      setPhase("win");
      return;
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 90);
    return () => clearTimeout(t);
  }, [phase, lineIndex]);

  useEffect(() => {
    if (phase !== "win") return;
    const start = Date.now();
    const dur = 1800;
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / dur) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setPhase("done");
          setTimeout(onComplete, 250);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, onComplete]);

  const skip = () => {
    setPhase("done");
    setTimeout(onComplete, 200);
  };

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 font-mono-y2k"
      >
        {phase === "bios" && (
          <div className="w-full max-w-2xl">
            <pre className="text-[#d0d0d0] text-sm leading-tight whitespace-pre-wrap">
              {BOOT_LINES.slice(0, lineIndex).join("\n")}
              <span className="cursor-blink text-[#d0d0d0]">_</span>
            </pre>
          </div>
        )}

        {phase === "win" && (
          <div className="flex flex-col items-center gap-6 text-[#d0d0d0]">
            <div className="font-pixel text-2xl md:text-4xl text-center">
              <span className="block">WINDOWS</span>
              <span className="block text-sm md:text-base mt-2 opacity-80">opsec_98</span>
            </div>
            <div className="w-72 h-5 bevel-in p-1">
              <div
                className="h-full bg-gradient-to-r from-[#5a5a5a] via-[#f0f0f0] to-[#5a5a5a] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono-y2k text-lg text-[#b0b0b0]">
              {Math.floor(progress)}%
            </p>
          </div>
        )}

        {showSkip && (
          <button
            onClick={skip}
            className="fixed bottom-6 right-6 px-3 py-1.5 bevel-out-dark text-[10px] font-pixel text-[#f0f0f0] hover:bg-[#2a2a2a]"
          >
            SKIP &gt;
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
