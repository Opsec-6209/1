import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COINS = [
  { name: "Bitcoin",  address: "bc1q9h6tq8j5g7z3r2v4x6y8n1m3p5q7s9u2w4e6t8" },
  { name: "Ethereum", address: "0x8f3C2A1B9D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9" },
  { name: "Solana",   address: "5xK9mN2pQ7rT4vW8yB1cE3fH6jL0nP5qS8uV2wX4yZ7aD9eF1gH3iJ6kM0pR2sU5vY8z" },
];

const BOOT = [
  "Microsoft Windows 98 [Version 4.10.1998]",
  "(C) Copyright Microsoft Corp 1981-1998.",
  "",
  "C:\\WINDOWS\\Desktop> echo on",
];

export function TerminalSection() {
  const [lines, setLines] = useState<string[]>(BOOT);
  const [copied, setCopied] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let delay = 0;
    timeouts.push(setTimeout(() => setLines((l) => [...l, ""]), delay += 200));
    timeouts.push(setTimeout(() => setLines((l) => [...l, "C:\\> echo === CRYPTO ADDRESSES ==="]), delay += 200));
    COINS.forEach((c) => {
      timeouts.push(setTimeout(() => setLines((l) => [...l, `C:\\> echo ${c.name}: ${c.address}`]), delay += 100));
    });
    timeouts.push(setTimeout(() => setLines((l) => [...l, ""]), delay += 200));
    timeouts.push(setTimeout(() => setLines((l) => [...l, "C:\\> echo Click any address to copy"]), delay += 200));
    timeouts.push(setTimeout(() => setLines((l) => [...l, "C:\\> _"]), delay += 100));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(address);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="font-mono-y2k text-[12px] text-[#f0f0f0] bg-[#0a0a0a] bevel-in p-2 min-h-[280px]">
      <div ref={scrollRef} className="max-h-[260px] overflow-y-auto">
        {lines.map((line, i) => {
          const coin = COINS.find((c) => line.includes(c.address));
          if (coin) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white px-1 -mx-1"
                onClick={() => handleCopy(coin.address)}
              >
                {line}
                {copied === coin.address && (
                  <span className="ml-2 text-[#00ff00]">[COPIED!]</span>
                )}
              </motion.div>
            );
          }
          return <div key={i}>{line}</div>;
        })}
      </div>
    </div>
  );
}
