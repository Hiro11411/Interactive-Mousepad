import { useCallback, useMemo, useState } from "react";
import { SkinCard } from "./SkinCard";
import { SkinFilters } from "./SkinFilters";
import type { SkinFilter } from "./SkinFilters";
import { useSkins } from "../../context/SkinContext";
import { useLogs } from "../../context/LogContext";

export function SkinBrowser() {
  const { allSkins, activeSkinId, setActiveSkinId } = useSkins();
  const { addLog } = useLogs();
  const [filter, setFilter] = useState<SkinFilter>("all");

  const visibleSkins = useMemo(() => {
    if (filter === "all") return allSkins;
    return allSkins.filter((s) => s.type === filter);
  }, [allSkins, filter]);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveSkinId(id);
      addLog(`Skin selected: ${id}`);
      // TODO(hiro): connect to Tauri backend — { cmd: "set_skin", id }
    },
    [setActiveSkinId, addLog],
  );

  return (
    <div className="px-8 py-8">
      <header className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2
            className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
          >
            Skins
          </h2>
          <p className="text-xs text-gray-600">
            {visibleSkins.length} of {allSkins.length} available
          </p>
        </div>
        <SkinFilters active={filter} onChange={setFilter} />
      </header>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {visibleSkins.map((skin) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            isActive={activeSkinId === skin.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
