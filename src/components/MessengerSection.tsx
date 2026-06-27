const BUDDIES = [
  { name: "opsec_6209",        status: "online",  msg: "yo check my TikTok 🔥",     href: "https://www.tiktok.com/@opsec_6209" },
  { name: "opsec_6209 (DC)",   status: "online",  msg: "discord me opsec_6209",     href: "https://discord.com/users/868572830269329439" },
  { name: "opsec_6209 (GH)",   status: "online",  msg: "github.com/Opsec-6209",    href: "https://github.com/Opsec-6209" },
];

const STATUS_COLORS: Record<string, string> = {
  online: "#00aa00",
  away: "#aa8800",
  busy: "#aa0000",
};

export function MessengerSection() {
  return (
    <div className="font-mono-y2k text-[12px] text-black">
      <div className="bg-[#1c1c1c] text-[#f0f0f0] px-2 py-1 font-pixel text-[10px] mb-2">
        opsec_6209 — Contact List
      </div>

      <div className="bevel-in bg-white p-2 max-h-[260px] overflow-y-auto">
        {BUDDIES.map((b) => (
          <div key={b.name} className="border-b border-[#d0d0d0] py-2 last:border-0">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: STATUS_COLORS[b.status] }}
              />
              <span className="font-bold text-[12px]">{b.name}</span>
              <span className="text-[10px] text-[#5a5a5a]">({b.status})</span>
            </div>
            <div className="text-[10px] text-[#5a5a5a] italic mt-0.5 ml-4">
              {b.msg}
            </div>
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-block mt-1 text-[10px] text-[#0000aa] underline hover:text-[#aa0000]"
            >
              {b.href}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[10px] text-[#5a5a5a] italic">
        Last seen: just now
      </div>
    </div>
  );
}
