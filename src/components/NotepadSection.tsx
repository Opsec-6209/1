import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FULL_TEXT = `opsec_6209.txt - Notepad
====================================
  User Profile
====================================

  Username    : opsec_6209
  Location    : Germany, NRW
  Status      : <online>
  Joined      : 2020
  
  Skills      : React, TypeScript,
                Python, Vite, Node.js
  
  Hobbies     : Music, Anime,
                Gaming, Nightcore
  
  Music       : 26 tracks loaded
                Player: Winamp 2.91
  
  Favorite OS : Arch Linux
  Favorite IDE: VS Code
  DPI         : 1000
  Keyboard    : WASD Movement
  
  Contact:
   - TikTok  : @opsec_6209
   - Discord : opsec_6209#0000
   - GitHub  : Opsec-6209

====================================
  END OF FILE
`;

function scrambleText(target: string, onUpdate: (s: string) => void, onDone: () => void) {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  let frame = 0;
  const queue: { from: string; to: string; start: number; end: number }[] = [];
  for (let i = 0; i < target.length; i++) {
    const from = target[i];
    const to = target[i];
    const start = Math.floor(Math.random() * 30);
    const end = start + 20 + Math.floor(Math.random() * 30);
    queue.push({ from, to, start, end });
  }
  const interval = setInterval(() => {
    let output = "";
    let complete = 0;
    for (let i = 0; i < target.length; i++) {
      const q = queue[i];
      if (frame >= q.end) {
        complete++;
        output += q.to;
      } else if (frame >= q.start) {
        output += chars[Math.floor(Math.random() * chars.length)];
      } else {
        output += target[i];
      }
    }
    onUpdate(output);
    frame++;
    if (complete === target.length) {
      clearInterval(interval);
      onDone();
    }
  }, 30);
}

export function NotepadSection() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    scrambleText(FULL_TEXT, setText, () => setDone(true));
  }, []);

  return (
    <div className="font-mono-y2k text-[13px] leading-tight whitespace-pre-wrap text-black bg-[#c0c0c0] p-2 bevel-in min-h-[300px]">
      <motion.pre
        animate={done ? { opacity: [1, 0.92, 1] } : {}}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
        className="m-0"
      >
        {text || " "}
      </motion.pre>
      <span className="cursor-blink inline-block w-2 h-4 bg-black align-middle" />
    </div>
  );
}
