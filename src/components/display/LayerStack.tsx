import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { Slider } from "../shared/Slider";
import { IconButton } from "../shared/IconButton";
import { useLayers } from "../../context/LayerContext";
import { useLogs } from "../../context/LogContext";
import type { Layer } from "../../types";

interface LayerRowProps {
  layer: Layer;
  onOpacityCommit: (id: string, value: number) => void;
  onToggleVisible: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: () => void;
}

const LayerRow = memo(function LayerRow({
  layer,
  onOpacityCommit,
  onToggleVisible,
  onDragStart,
  onDragOver,
  onDrop,
}: LayerRowProps) {
  const [localOpacity, setLocalOpacity] = useState(layer.opacity);

  useEffect(() => setLocalOpacity(layer.opacity), [layer.opacity]);

  const commit = useCallback(
    (value: number) => onOpacityCommit(layer.id, value),
    [layer.id, onOpacityCommit],
  );

  return (
    <div
      draggable
      onDragStart={() => onDragStart(layer.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(layer.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className="flex items-center gap-3 px-5 py-3 border-b border-[#1A1A1A]
        last:border-b-0 hover:bg-[#0E0E0E] transition-colors duration-150"
    >
      <span className="cursor-grab active:cursor-grabbing text-gray-600
        hover:text-gray-300 transition-colors duration-150">
        <GripVertical strokeWidth={1.5} size={14} />
      </span>
      <span
        className={`flex-1 text-[11px] uppercase tracking-widest
          ${layer.visible ? "text-gray-300" : "text-gray-600"}`}
      >
        {layer.name}
      </span>
      <div className="w-44">
        <Slider
          value={localOpacity}
          onChange={setLocalOpacity}
          onChangeEnd={commit}
          showValue
        />
      </div>
      <IconButton
        active={layer.visible}
        title={layer.visible ? "Hide layer" : "Show layer"}
        onClick={() => onToggleVisible(layer.id)}
      >
        {layer.visible ? (
          <Eye strokeWidth={1.5} size={14} />
        ) : (
          <EyeOff strokeWidth={1.5} size={14} />
        )}
      </IconButton>
    </div>
  );
});

export const LayerStack = memo(function LayerStack() {
  const { layers, reorderLayers, setLayerOpacity, toggleLayerVisible } = useLayers();
  const { addLog } = useLogs();

  // Local visual order during drag; only commit to context on drop.
  const [draftLayers, setDraftLayers] = useState<Layer[] | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const currentLayers = draftLayers ?? layers;

  const handleDragStart = useCallback((id: string) => {
    dragIdRef.current = id;
    setDraftLayers(layers);
  }, [layers]);

  const handleDragOver = useCallback((overId: string) => {
    const dragId = dragIdRef.current;
    if (!dragId || dragId === overId) return;
    setDraftLayers((current) => {
      const list = current ?? layers;
      const from = list.findIndex((l) => l.id === dragId);
      const to = list.findIndex((l) => l.id === overId);
      if (from === -1 || to === -1) return list;
      const next = list.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, [layers]);

  const handleDrop = useCallback(() => {
    if (draftLayers) {
      reorderLayers(draftLayers);
      addLog("Layer order updated");
      // TODO(hiro): connect to Tauri backend — { cmd: "set_layer_order", order: [...] }
    }
    dragIdRef.current = null;
    setDraftLayers(null);
  }, [draftLayers, reorderLayers, addLog]);

  const handleOpacityCommit = useCallback(
    (id: string, value: number) => {
      setLayerOpacity(id, value);
      addLog(`Layer "${id}" opacity ${value}%`);
      // TODO(hiro): connect to Tauri backend — { cmd: "set_layer_opacity", id, value }
    },
    [setLayerOpacity, addLog],
  );

  const handleToggleVisible = useCallback(
    (id: string) => {
      toggleLayerVisible(id);
      addLog(`Layer "${id}" toggled`);
      // TODO(hiro): connect to Tauri backend — { cmd: "toggle_layer", id }
    },
    [toggleLayerVisible, addLog],
  );

  return (
    <section className="px-8 pb-8">
      <div className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600"
        >
          Layer Stack
        </header>
        <div>
          {currentLayers.map((layer) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              onOpacityCommit={handleOpacityCommit}
              onToggleVisible={handleToggleVisible}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
