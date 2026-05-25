import { memo, useCallback, useEffect, useState } from "react";
import { Slider } from "../shared/Slider";
import { Toggle } from "../shared/Toggle";
import type { Overlay, OverlayState } from "../../types";

interface OverlayCardProps {
  overlay: Overlay;
  state: OverlayState;
  onToggle: (id: string) => void;
  onOpacityCommit: (id: string, opacity: number) => void;
}

export const OverlayCard = memo(function OverlayCard({
  overlay,
  state,
  onToggle,
  onOpacityCommit,
}: OverlayCardProps) {
  const [localOpacity, setLocalOpacity] = useState(state.opacity);

  useEffect(() => setLocalOpacity(state.opacity), [state.opacity]);

  const commit = useCallback(
    (value: number) => onOpacityCommit(overlay.id, value),
    [overlay.id, onOpacityCommit],
  );

  return (
    <div
      className={`bg-[#111] border transition-colors duration-150
        ${state.enabled ? "border-rose-600" : "border-[#222] hover:border-[#333]"}`}
    >
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-white">{overlay.name}</div>
          <div className="text-[11px] text-gray-500 mt-1">
            {overlay.description}
          </div>
        </div>
        <Toggle checked={state.enabled} onChange={() => onToggle(overlay.id)} />
      </div>
      {state.enabled ? (
        <div className="px-5 py-3 border-t border-[#1A1A1A]">
          <Slider
            label="Opacity"
            value={localOpacity}
            onChange={setLocalOpacity}
            onChangeEnd={commit}
          />
        </div>
      ) : null}
    </div>
  );
});
