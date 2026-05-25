import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { LegendItem } from "./LegendItem";
import { Button } from "../shared/Button";
import { Slider } from "../shared/Slider";
import { IconButton } from "../shared/IconButton";
import { STORAGE_KEYS } from "../../constants";
import { loadFromStorage, usePersist } from "../../context/persist";
import { useLogs } from "../../context/LogContext";
import type { Legend, LegendColor } from "../../types";

const DEFAULT_LEGENDS: Legend[] = [
  {
    id: "default-legend",
    text: "PROFILE: DEFAULT",
    x: 2,
    y: 2,
    fontSize: 12,
    color: "white",
    opacity: 100,
  },
];

const COLOR_OPTIONS: { id: LegendColor; label: string; swatch: string }[] = [
  { id: "white", label: "White", swatch: "bg-white" },
  { id: "gray", label: "Gray", swatch: "bg-gray-400" },
  { id: "rose", label: "Rose", swatch: "bg-rose-600" },
];

function makeId(): string {
  return `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function LegendsEditor() {
  const [legends, setLegends] = useState<Legend[]>(() =>
    loadFromStorage(STORAGE_KEYS.legend, DEFAULT_LEGENDS),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    DEFAULT_LEGENDS[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<Record<string, { x: number; y: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { addLog } = useLogs();

  usePersist(STORAGE_KEYS.legend, legends);

  const selected = legends.find((l) => l.id === selectedId) ?? null;
  const [localOpacity, setLocalOpacity] = useState(selected?.opacity ?? 100);
  const [localFontSize, setLocalFontSize] = useState(selected?.fontSize ?? 12);

  useEffect(() => {
    if (selected) {
      setLocalOpacity(selected.opacity);
      setLocalFontSize(selected.fontSize);
    }
  }, [selected]);

  const updateLegend = useCallback((id: string, patch: Partial<Legend>) => {
    setLegends((list) => list.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const handleAdd = useCallback(() => {
    const id = makeId();
    const next: Legend = {
      id,
      text: "NEW LEGEND",
      x: 40,
      y: 40,
      fontSize: 12,
      color: "white",
      opacity: 100,
    };
    setLegends((list) => [...list, next]);
    setSelectedId(id);
    addLog(`Legend added: ${id}`);
  }, [addLog]);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setLegends((list) => list.filter((l) => l.id !== selectedId));
    addLog(`Legend deleted: ${selectedId}`);
    setSelectedId(null);
  }, [selectedId, addLog]);

  const handleDragChange = useCallback((id: string, x: number, y: number) => {
    setDraft((d) => ({ ...d, [id]: { x, y } }));
  }, []);

  const handleDragCommit = useCallback(
    (id: string, x: number, y: number) => {
      updateLegend(id, { x, y });
      setDraft((d) => {
        const { [id]: _, ...rest } = d;
        return rest;
      });
    },
    [updateLegend],
  );

  const legendsForRender = legends.map((l) => {
    const d = draft[l.id];
    return d ? { ...l, x: d.x, y: d.y } : l;
  });

  return (
    <div className="px-8 py-8 grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h2
              className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
            >
              Legends
            </h2>
            <p className="text-xs text-gray-600">
              Click and drag labels on the surface. Click to select.
            </p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            Add Legend
          </Button>
        </header>
        <div
          ref={containerRef}
          onMouseDown={() => setSelectedId(null)}
          className="relative bg-[#0A0A0A] border border-[#222]"
          style={{ aspectRatio: "16 / 9" }}
        >
          {legendsForRender.map((legend) => (
            <LegendItem
              key={legend.id}
              legend={legend}
              isSelected={legend.id === selectedId}
              containerRef={containerRef}
              onSelect={setSelectedId}
              onDragChange={handleDragChange}
              onDragCommit={handleDragCommit}
            />
          ))}
        </div>
      </div>

      <aside className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600
            flex items-center justify-between"
        >
          <span>Inspector</span>
          {selected ? (
            <IconButton title="Delete legend" onClick={handleDelete}>
              <Trash2 strokeWidth={1.5} size={14} />
            </IconButton>
          ) : null}
        </header>
        <div className="px-5 py-5 space-y-5">
          {!selected ? (
            <p className="text-[11px] uppercase tracking-widest text-gray-600">
              Select a legend to edit
            </p>
          ) : (
            <>
              <div className="space-y-1.5">
                <label
                  className="text-[10px] uppercase tracking-widest text-gray-600"
                >
                  Text
                </label>
                <input
                  type="text"
                  value={selected.text}
                  onChange={(e) =>
                    updateLegend(selected.id, { text: e.target.value })
                  }
                  className="w-full border border-[#222] px-3 py-2 text-xs
                    text-white hover:border-[#333] focus:border-rose-600
                    transition-colors duration-150"
                />
              </div>
              <Slider
                label="Font"
                value={localFontSize}
                min={8}
                max={48}
                valueSuffix="px"
                onChange={setLocalFontSize}
                onChangeEnd={(v) => updateLegend(selected.id, { fontSize: v })}
              />
              <Slider
                label="Opacity"
                value={localOpacity}
                onChange={setLocalOpacity}
                onChangeEnd={(v) => updateLegend(selected.id, { opacity: v })}
              />
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-gray-600">
                  Color
                </div>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateLegend(selected.id, { color: c.id })}
                      title={c.label}
                      className={`w-7 h-7 border transition-colors duration-150
                        ${selected.color === c.id
                          ? "border-rose-600"
                          : "border-[#222] hover:border-[#333]"}`}
                    >
                      <span className={`block w-full h-full ${c.swatch}`} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
