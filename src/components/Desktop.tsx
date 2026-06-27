import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Folder, FileText, MessageSquare, Terminal, Music } from "lucide-react";

interface DesktopProps { onOpen: (id: string) => void; }

const ICONS = [
  { id: "about",    label: "opsec_6209.txt", icon: <FileText size={28} /> },
  { id: "projects", label: "projects.lnk",    icon: <Folder size={28} /> },
  { id: "skills",   label: "skills.exe",      icon: <Terminal size={28} /> },
  { id: "social",   label: "messenger.exe",   icon: <MessageSquare size={28} /> },
  { id: "crypto",   label: "cmd.exe",         icon: <Terminal size={28} /> },
  { id: "music",    label: "winamp.exe",      icon: <Music size={28} /> },
];

export function Desktop({ onOpen }: DesktopProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [doubleClick, setDoubleClick] = useState<string | null>(null);

  const handleDouble = useCallback((id: string) => {
    setDoubleClick(id);
    setTimeout(() => setDoubleClick(null), 300);
    setTimeout(() => onOpen(id), 100);
  }, [onOpen]);

  return (
    <div className="fixed inset-0 grid-bg pointer-events-none" style={{ paddingBottom: 40 }}>
      {/* Center PFP */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-3">
        <div className="relative group cursor-pointer" onClick={() => onOpen("about")}>
          <div className="absolute -inset-4 rounded-full bg-[#1c1c1c] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
          <img src="/1/pfp.png" alt="opsec_6209" className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 pixelated border-2 border-[#5a5a5a] group-hover:border-[#f0f0f0] transition-colors" style={{ imageRendering: "pixelated" }} draggable={false} />
          <p className="text-center mt-1 sm:mt-2 font-pixel text-[8px] sm:text-[10px] text-[#f0f0f0]">opsec_6209.exe</p>
        </div>
      </div>

      {/* Top right info */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <div className="font-pixel text-[8px] sm:text-[10px] text-[#f0f0f0] text-right bg-[#0a0a0a]/60 px-2 py-1 border border-[#3a3a3a]">
          <div>opsec_6209</div>
          <div className="text-[7px] sm:text-[8px] text-[#b0b0b0]">Germany, NRW</div>
        </div>
      </div>

      {/* Icons - horizontal on mobile, vertical on desktop */}
      <div className="absolute left-2 right-2 bottom-[44px] sm:left-3 sm:bottom-auto sm:top-3 sm:right-auto pointer-events-auto">
        <div className="flex flex-wrap sm:flex-col gap-1 sm:gap-0.5 justify-center sm:justify-start">
          {ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => setSelected(icon.id)}
              onDoubleClick={() => handleDouble(icon.id)}
              onTouchEnd={(e) => {
                const t = e.currentTarget;
                const now = Date.now();
                const last = Number(t.dataset.lastTap || "0");
                t.dataset.lastTap = String(now);
                if (now - last < 400) handleDouble(icon.id);
                else setSelected(icon.id);
              }}
              className={`group flex flex-col items-center gap-0.5 p-1 w-18 sm:w-20 select-none ${selected === icon.id ? "bg-[#1c1c1c]/60 outline outline-1 outline-dotted outline-[#f0f0f0]" : ""}`}
            >
              <div className={`text-[#f0f0f0] ${doubleClick === icon.id ? "scale-95" : "group-hover:text-white"} transition-all`}>{icon.icon}</div>
              <span className="font-pixel text-[7px] sm:text-[8px] text-[#f0f0f0] text-center leading-tight hidden sm:block">{icon.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
