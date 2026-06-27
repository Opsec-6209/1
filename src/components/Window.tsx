import { useState, useRef, useCallback } from "react";
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
  width = "w-[min(94vw,720px)]",
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
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    return { x: isMobile ? 4 : defaultX, y: isMobile ? 50 : defaultY };
  });
  const [zIndex, setZIndex] = useState(initialFocused ? 50 : 10);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const dragRef = useRef<{ ox: number; oy: number; pid: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (maximized) return;
      setZIndex((z) => z + 1);
      dragRef.current = {
        ox: e.clientX - pos.x,
        oy: e.clientY - pos.y,
        pid: e.pointerId,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [maximized, pos]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || e.pointerId !== dragRef.current.pid || maximized) return;
      setPos({
        x: Math.max(-100, e.clientX - dragRef.current.ox),
        y: Math.max(0, e.clientY - dragRef.current.oy),
      });
    },
    [maximized]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      if (posKey) {
        try {
          localStorage.setItem(posKey, JSON.stringify(pos));
        } catch {}
      }
      dragRef.current = null;
    },
    [pos, posKey]
  );

  if (minimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onPointerDown={() => setZIndex((z) => z + 1)}
      style={{
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100vw" : undefined,
        height: maximized ? "calc(100vh - 36px)" : undefined,
        zIndex,
        position: "absolute",
      }}
      className={`${maximized ? "" : width} ${maximized ? "" : height} bevel-out-dark bg-[#c0c0c0] select-none max-w-[100vw] ${className}`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => setMaximized((m) => !m)}
        className="win95-title px-2 py-1 flex items-center justify-between touch-none text-[10px] sm:text-[11px]"
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="w-3 h-3 flex items-center justify-center flex-shrink-0">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
          <button onClick={(e) => { e.stopPropagation(); setMinimized(true); }} onPointerDown={(e) => e.stopPropagation()} className="w-6 h-5 sm:w-5 sm:h-5 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]" aria-label="Minimize"><Minus size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); setMaximized((m) => !m); }} onPointerDown={(e) => e.stopPropagation()} className="w-6 h-5 sm:w-5 sm:h-5 bevel-out-dark flex items-center justify-center hover:bg-[#3a3a3a]" aria-label="Maximize"><Square size={9} /></button>
          <button onClick={(e) => { e.stopPropagation(); onClose?.(); }} onPointerDown={(e) => e.stopPropagation()} className="w-6 h-5 sm:w-5 sm:h-5 bevel-out-dark flex items-center justify-center hover:bg-[#aa0000] hover:text-white" aria-label="Close"><X size={10} /></button>
        </div>
      </div>
      <div className="p-2 sm:p-3 bg-[#c0c0c0] text-black max-h-[calc(100vh-140px)] overflow-auto text-[11px] sm:text-[12px]">
        {children}
      </div>
    </motion.div>
  );
}
