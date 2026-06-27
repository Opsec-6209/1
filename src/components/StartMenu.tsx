import { motion, AnimatePresence } from "framer-motion";
import { Power, Folder, FileText, MessageSquare, Music, Terminal } from "lucide-react";

interface StartMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: (id: string) => void;
  onShutdown: () => void;
}

const ITEMS = [
  { id: "about",    label: "About opsec_6209",  icon: FileText },
  { id: "projects", label: "Projects",           icon: Folder },
  { id: "skills",   label: "System Info",        icon: Terminal },
  { id: "social",   label: "MSN Messenger",      icon: MessageSquare },
  { id: "music",    label: "Winamp",             icon: Music },
  { id: "crypto",   label: "MS-DOS Prompt",      icon: Terminal },
];

export function StartMenu({ open, onClose, onOpen, onShutdown }: StartMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.1 }}
          className="fixed bottom-9 left-1 z-[70] w-72 bevel-out-dark bg-[#c0c0c0] flex font-mono-y2k"
          onMouseLeave={onClose}
        >
          <div className="win95-title w-12 flex flex-col items-center justify-center p-2 text-[#f0f0f0]">
            <img src="/1/pfp.png" alt="" className="w-10 h-10 pixelated mb-1" />
            <span className="font-pixel text-[8px]">opsec</span>
          </div>
          <div className="flex-1 p-1">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onOpen(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-2 py-1 text-[12px] text-black hover:bg-[#1c1c1c] hover:text-[#f0f0f0] text-left"
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-[#5a5a5a] my-1" />
            <button
              onClick={onShutdown}
              className="w-full flex items-center gap-2 px-2 py-1 text-[12px] text-black hover:bg-[#1c1c1c] hover:text-[#f0f0f0] text-left"
            >
              <Power size={14} />
              <span>Shut down...</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
