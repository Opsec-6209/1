import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { BootSequence } from "./components/BootSequence";
import { Desktop } from "./components/Desktop";
import { Taskbar } from "./components/Taskbar";
import { StartMenu } from "./components/StartMenu";
import { Window } from "./components/Window";
import { WinampPlayer } from "./components/WinampPlayer";
import { NotepadSection } from "./components/NotepadSection";
import { SystemInfoSection } from "./components/SystemInfoSection";
import { FileExplorerSection } from "./components/FileExplorerSection";
import { MessengerSection } from "./components/MessengerSection";
import { TerminalSection } from "./components/TerminalSection";
import { ShutdownScreen, BlackScreen } from "./components/ShutdownScreen";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { Folder, FileText, MessageSquare, Terminal as TerminalIcon, Music } from "lucide-react";

const WINDOW_DEFS: Record<string, { title: string; icon: React.ReactNode; defaultX: number; defaultY: number; width: string; height?: string }> = {
  about:    { title: "opsec_6209.txt — Notepad",        icon: <FileText size={12} />,      defaultX: 80,  defaultY: 60,  width: "w-[min(94vw,560px)]" },
  projects: { title: "Projects — Windows Explorer",      icon: <Folder size={12} />,         defaultX: 200, defaultY: 80,  width: "w-[min(94vw,720px)]" },
  skills:   { title: "System Information",               icon: <TerminalIcon size={12} />,   defaultX: 120, defaultY: 100, width: "w-[min(94vw,640px)]" },
  social:   { title: "MSN Messenger — Contacts",         icon: <MessageSquare size={12} />,  defaultX: 150, defaultY: 120, width: "w-[min(94vw,480px)]" },
  music:    { title: "Winamp 2.91",                      icon: <Music size={12} />,          defaultX: 100, defaultY: 140, width: "w-[min(94vw,560px)]" },
  crypto:   { title: "C:\\WINDOWS\\system32\\cmd.exe", icon: <TerminalIcon size={12} />,   defaultX: 180, defaultY: 100, width: "w-[min(94vw,640px)]" },
};

function useKonamiBSOD(setShutdownOpen: (v: boolean) => void) {
  useEffect(() => {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let i = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === seq[i] || e.key.toLowerCase() === seq[i]) {
        i++;
        if (i === seq.length) {
          i = 0;
          setShutdownOpen(true);
        }
      } else {
        i = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShutdownOpen]);
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [shutDown, setShutDown] = useState(false);
  const player = useAudioPlayer();

  useKonamiBSOD(setShutdownOpen);

  useEffect(() => {
    if (!booted) return;
    const tryPlay = () => player.play();
    tryPlay();
    const events: (keyof WindowEventMap)[] = ["click", "keydown", "scroll", "touchstart", "pointerdown", "wheel"];
    const handler = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    const t = setTimeout(() => {
      events.forEach((e) => window.addEventListener(e, handler, { once: true, passive: true }));
    }, 800);
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const handleOpen = useCallback((id: string) => {
    setOpenWindows((w) => (w.includes(id) ? w : [...w, id]));
  }, []);

  const handleClose = (id: string) => {
    setOpenWindows((w) => w.filter((x) => x !== id));
  };

  openWindows.map((id) => ({ id, title: WINDOW_DEFS[id]?.title || id }));

  return (
    <>
      <BootSequence onComplete={() => setBooted(true)} />

      {booted && (
        <>
          <div className="pixel-noise" />
          <div className="crt-overlay" />

          <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a]">
            <Desktop onOpen={handleOpen} />

            <div className="relative w-full h-full pointer-events-none">
              <AnimatePresence>
                {openWindows.includes("about") && (
                  <Window
                    key="about"
                    title="opsec_6209.txt — Notepad"
                    icon={<FileText size={12} />}
                    defaultX={80}
                    defaultY={60}
                    width="w-[min(94vw,560px)]"
                    onClose={() => handleClose("about")}
                    storageKey="about"
                  >
                    <NotepadSection />
                  </Window>
                )}
                {openWindows.includes("projects") && (
                  <Window
                    key="projects"
                    title="Projects — Windows Explorer"
                    icon={<Folder size={12} />}
                    defaultX={200}
                    defaultY={80}
                    width="w-[min(94vw,720px)]"
                    onClose={() => handleClose("projects")}
                    storageKey="projects"
                  >
                    <FileExplorerSection />
                  </Window>
                )}
                {openWindows.includes("skills") && (
                  <Window
                    key="skills"
                    title="System Information"
                    icon={<TerminalIcon size={12} />}
                    defaultX={120}
                    defaultY={100}
                    width="w-[min(94vw,640px)]"
                    onClose={() => handleClose("skills")}
                    storageKey="skills"
                  >
                    <SystemInfoSection />
                  </Window>
                )}
                {openWindows.includes("social") && (
                  <Window
                    key="social"
                    title="MSN Messenger — Contacts"
                    icon={<MessageSquare size={12} />}
                    defaultX={150}
                    defaultY={120}
                    width="w-[min(94vw,480px)]"
                    onClose={() => handleClose("social")}
                    storageKey="social"
                  >
                    <MessengerSection />
                  </Window>
                )}
                {openWindows.includes("music") && (
                  <Window
                    key="music"
                    title="Winamp 2.91"
                    icon={<Music size={12} />}
                    defaultX={100}
                    defaultY={140}
                    width="w-[min(94vw,560px)]"
                    onClose={() => handleClose("music")}
                    storageKey="music"
                  >
                    <WinampPlayer player={player} />
                  </Window>
                )}
                {openWindows.includes("crypto") && (
                  <Window
                    key="crypto"
                    title="C:\WINDOWS\system32\cmd.exe"
                    icon={<TerminalIcon size={12} />}
                    defaultX={180}
                    defaultY={100}
                    width="w-[min(94vw,640px)]"
                    onClose={() => handleClose("crypto")}
                    storageKey="crypto"
                  >
                    <TerminalSection />
                  </Window>
                )}
              </AnimatePresence>
            </div>

            <Taskbar
              player={player}
              onOpenWindow={handleOpen}
              openWindows={openWindows.map((id) => ({ id, title: WINDOW_DEFS[id]?.title || id }))}
              startMenuOpen={startOpen}
              setStartMenuOpen={setStartOpen}
              onShutdown={() => setShutdownOpen(true)}
            />

            <StartMenu
              open={startOpen}
              onClose={() => setStartOpen(false)}
              onOpen={handleOpen}
              onShutdown={() => {
                setStartOpen(false);
                setShutdownOpen(true);
              }}
            />

            <ShutdownScreen
              show={shutdownOpen}
              onCancel={() => setShutdownOpen(false)}
              onConfirm={() => {
                setShutdownOpen(false);
                setShutDown(true);
              }}
            />

            <BlackScreen show={shutDown} />
          </div>
        </>
      )}
    </>
  );
}
