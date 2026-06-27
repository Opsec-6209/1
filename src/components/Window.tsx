import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Minus, Square, X } from "lucide-react";

interface WindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultX?: number;
  defaultY?: number;
  width?: string;
  height?: string;
  className?: string;
  onClose?: () => void;
  initialFocused?: boolean;
  storageKey?: string;
}

export function Window({
  title,
  icon,
  children,
  defaultX = 40,
  defaultY = 40,
  width = "w-[min(92vw,720px)]",
  height = "h-auto",
  className = "",
  onClose,
  initialFocused = true,
  storageKey,
}: WindowProps) {
  const posKey = storageKey ? `win-pos-${storageKey}` : null;
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (posKey) {
      try {
        const stored = localStorage.getItem(posKey);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return { x: defaultX, y: defaultY };
  });
  const [zIndex, setZIndex] = useState(initialFocused ? 50 : 10);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragging, setDragging] = useState<{ ox: number; oy: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    setZIndex((z) => z + 1);
    setDragging({
      ox: e.clientX - pos.x,
      oy: e.clientY - pos.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const newX = Math.max(0, e.clientX - dragging.ox);
    const newY = Math.max(0, e.clientY - dragging.oy);
    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (dragging && posKey) {
      try {
        localStorage.setItem(posKey, JSON.stringify(pos));
      } catch {}
    }
    setDragging(null);
  };

  if (typeof window !== "undefined") {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    }
  }

  if (minimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onMouseDown={() => setZIndex((z) => z + 1)}
      style={{
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100vw" : undefined,
        height: maximized ? "calc(100vh - 36px)" : undefined,
        zIndex,
        position: "absolute",
      }}
      className={`${maximized ? "" : width} ${maximized ? "" : height} bevel-out-dark bg-[#c0c0c0] select-none ${className}`}
    >
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setMaximized((m) => !m)}
        className="win95-title px-2 py-1 flex items-center justify-between cursor-move text-[11px]"
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="w-3 h-3 flex items-center justify-center">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-5 h-5 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]"
            aria-label="Minimize"
          >
            <Minus size={10} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMaximized((m) => !m);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-5 h-5 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]"
            aria-label="Maximize"
          >
            <Square size={9} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-5 h-5 bevel-out-dark flex items-center justify-center hover:bg-[#aa0000] hover:text-white"
            aria-label="Close"
          >
            <X size={10} />
          </button>
        </div>
      </div>
      <div className="p-3 bg-[#c0c0c0] text-black max-h-[calc(100vh-100px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}
