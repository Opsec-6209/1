import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Folder, FileText, MessageSquare, Terminal, Music } from "lucide-react";

interface DesktopIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
}

interface DesktopProps {
  onOpen: (id: string) => void;
}

const ICONS: DesktopIcon[] = [
  { id: "about",    label: "opsec_6209.txt", icon: <FileText size={32} />,     x: 30,  y: 30 },
  { id: "projects", label: "projects.lnk",    icon: <Folder size={32} />,        x: 30,  y: 130 },
  { id: "skills",   label: "skills.exe",      icon: <Terminal size={32} />,      x: 30,  y: 230 },
  { id: "social",   label: "messenger.exe",   icon: <MessageSquare size={32} />, x: 30,  y: 330 },
  { id: "crypto",   label: "cmd.exe",         icon: <Terminal size={32} />,      x: 130, y: 30 },
  { id: "music",    label: "winamp.exe",      icon: <Music size={32} />,         x: 130, y: 130 },
];

export function Desktop({ onOpen }: DesktopProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [doubleClick, setDoubleClick] = useState<string | null>(null);
  const [clockPos, setClockPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setClockPos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 8,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 8,
        });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handleDouble = (id: string) => {
    setDoubleClick(id);
    setTimeout(() => setDoubleClick(null), 300);
    setTimeout(() => onOpen(id), 100);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 grid-bg pointer-events-none"
      style={{ paddingBottom: 36 }}
    >
      <motion.div
        style={{ x: clockPos.x, y: clockPos.y }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
      >
        <div
          onClick={() => onOpen("about")}
          className="group relative cursor-pointer"
        >
          <div className="absolute -inset-6 rounded-full bg-[#1c1c1c] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
          <img
            src="/1/pfp.png"
            alt="opsec_6209"
            className="relative w-32 h-32 md:w-44 md:h-44 pixelated border-2 border-[#5a5a5a] group-hover:border-[#f0f0f0] transition-colors"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />
          <p className="text-center mt-2 font-pixel text-[10px] text-[#f0f0f0] text-shadow-pixel">
            opsec_6209.exe
          </p>
        </div>
      </motion.div>

      {ICONS.map((icon) => (
        <div
          key={icon.id}
          className="absolute pointer-events-auto"
          style={{ left: icon.x, top: icon.y }}
        >
          <button
            onClick={() => setSelected(icon.id)}
            onDoubleClick={() => handleDouble(icon.id)}
            className={`group flex flex-col items-center gap-1 p-1 w-20 ${
              selected === icon.id ? "bg-[#1c1c1c]/60 outline outline-1 outline-dotted outline-[#f0f0f0]" : ""
            }`}
          >
            <div className={`text-[#f0f0f0] ${doubleClick === icon.id ? "scale-95" : "group-hover:text-white"} transition-all`}>
              {icon.icon}
            </div>
            <span className="font-pixel text-[8px] text-[#f0f0f0] text-center leading-tight text-shadow-pixel">
              {icon.label}
            </span>
          </button>
        </div>
      ))}

      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="font-pixel text-[10px] text-[#f0f0f0] text-right bg-[#0a0a0a]/60 px-2 py-1 border border-[#3a3a3a]">
          <div>opsec_6209</div>
          <div className="text-[8px] text-[#b0b0b0]">Germany, NRW</div>
        </div>
      </div>
    </div>
  );
}
