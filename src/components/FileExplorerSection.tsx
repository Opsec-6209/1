import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Folder } from "lucide-react";
import { useGitHubRepos } from "../hooks/useGitHubRepos";

export function FileExplorerSection() {
  const { repos, loading, error } = useGitHubRepos("Opsec-6209");
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="font-mono-y2k text-[12px] text-black">
      <div className="flex gap-1 mb-2 pb-2 border-b border-[#5a5a5a]">
        <button className="px-2 bevel-out-dark text-[10px]">Back</button>
        <button className="px-2 bevel-out-dark text-[10px]">Fwd</button>
        <button className="px-2 bevel-out-dark text-[10px] opacity-50">Up</button>
        <div className="flex-1 bevel-in bg-white px-2 text-[11px] flex items-center">
          C:\opsec_6209\projects\
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-4 gap-2 p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bevel-in bg-[#d0d0d0] animate-pulse" />
          ))}
        </div>
      )}

      {error && <div className="p-4 text-center text-[#aa0000]">Error loading projects.</div>}

      {!loading && !error && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 max-h-[300px] overflow-y-auto">
          {repos.slice(0, 12).map((repo) => (
            <button
              key={repo.id}
              onClick={() => setSelected(repo.id)}
              className={`flex flex-col items-center gap-1 p-2 text-center transition-colors ${
                selected === repo.id ? "bg-[#1c1c1c] text-[#f0f0f0]" : "hover:bg-[#d0d0d0]"
              }`}
            >
              <Folder size={28} className={selected === repo.id ? "text-[#f0f0f0]" : "text-[#5a5a5a]"} />
              <span className="text-[10px] truncate w-full">{repo.name}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bevel-in bg-white p-3 mt-2 text-[11px]"
        >
          {(() => {
            const r = repos.find((x) => x.id === selected);
            if (!r) return null;
            return (
              <>
                <div className="font-pixel text-[9px] mb-1">Properties — {r.name}</div>
                <div className="grid grid-cols-[80px_1fr] gap-1">
                  <div className="text-[#5a5a5a]">Type:</div>
                  <div>Application</div>
                  <div className="text-[#5a5a5a]">Language:</div>
                  <div>{r.language || "—"}</div>
                  <div className="text-[#5a5a5a]">Size:</div>
                  <div>{r.stargazers_count} stars · {r.forks_count} forks</div>
                  {r.description && (
                    <>
                      <div className="text-[#5a5a5a]">Description:</div>
                      <div>{r.description}</div>
                    </>
                  )}
                </div>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 bevel-out-dark px-3 py-1 text-[10px] hover:bg-[#d0d0d0]"
                >
                  <ExternalLink size={10} /> Open Source
                </a>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
