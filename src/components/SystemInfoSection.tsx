import { useState, useEffect } from "react";

const SKILLS = [
  { category: "Languages",     items: ["TypeScript", "JavaScript", "Python", "HTML5", "CSS3"] },
  { category: "Frameworks",    items: ["React", "Vite", "Electron", "Tailwind CSS", "Framer Motion"] },
  { category: "Tools",         items: ["Git", "GitHub", "VS Code", "Node.js", "npm"] },
  { category: "Libraries",     items: ["Monaco Editor", "Recharts", "Lucide React", "Lenis"] },
  { category: "Other",         items: ["HTML5 Canvas", "Web Audio API", "Selenium", "CustomTkinter"] },
];

export function SystemInfoSection() {
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(42);

  useEffect(() => {
    const id = setInterval(() => {
      setCpu(Math.floor(Math.random() * 35) + 5);
      setRam((r) => Math.max(30, Math.min(78, r + (Math.random() - 0.5) * 4)));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-mono-y2k text-[12px] text-black">
      <div className="mb-3 bevel-in p-2 bg-[#ffffff]">
        <div className="font-pixel text-[10px] mb-2 text-[#0a0a0a]">SKILLS.INI — System Resources</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>CPU Usage:</div>
          <div className="text-right">
            <span className="inline-block w-20 h-3 bevel-in bg-[#0a0a0a] align-middle mr-1 overflow-hidden">
              <span className="block h-full bg-[#5a5a5a]" style={{ width: `${cpu}%` }} />
            </span>
            {cpu}%
          </div>
          <div>Memory:</div>
          <div className="text-right">
            <span className="inline-block w-20 h-3 bevel-in bg-[#0a0a0a] align-middle mr-1 overflow-hidden">
              <span className="block h-full bg-[#5a5a5a]" style={{ width: `${ram}%` }} />
            </span>
            {ram}%
          </div>
        </div>
      </div>

      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1c1c1c] text-[#f0f0f0]">
            <th className="text-left px-2 py-1 font-pixel text-[9px]">Category</th>
            <th className="text-left px-2 py-1 font-pixel text-[9px]">Skills</th>
          </tr>
        </thead>
        <tbody>
          {SKILLS.map((row, i) => (
            <tr key={row.category} className={i % 2 === 0 ? "bg-[#ffffff]" : "bg-[#d0d0d0]"}>
              <td className="px-2 py-1 font-bold">{row.category}</td>
              <td className="px-2 py-1">{row.items.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
