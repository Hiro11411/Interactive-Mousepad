import { useCallback } from "react";
import { OverlayCard } from "./OverlayCard";
import { PLACEHOLDER_OVERLAYS } from "../../data/overlays";
import { useOverlays } from "../../context/OverlayContext";
import { useLogs } from "../../context/LogContext";

export function OverlayBrowser() {
  const { overlays, toggleOverlay, setOverlayOpacity } = useOverlays();
  const { addLog } = useLogs();

  const handleToggle = useCallback(
    (id: string) => {
      toggleOverlay(id);
      addLog(`Overlay toggled: ${id}`);
      // TODO(hiro): connect to Tauri backend — { cmd: "toggle_overlay", id }
    },
    [toggleOverlay, addLog],
  );

  const handleOpacityCommit = useCallback(
    (id: string, opacity: number) => {
      setOverlayOpacity(id, opacity);
      addLog(`Overlay "${id}" opacity ${opacity}%`);
      // TODO(hiro): connect to Tauri backend — { cmd: "set_overlay_opacity", id, opacity }
    },
    [setOverlayOpacity, addLog],
  );

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h2
          className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
        >
          Overlays
        </h2>
        <p className="text-xs text-gray-600">
          Compose data overlays on top of your active skin
        </p>
      </header>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {PLACEHOLDER_OVERLAYS.map((overlay) => {
          const state =
            overlays.find((o) => o.id === overlay.id) ?? {
              id: overlay.id,
              enabled: false,
              opacity: 100,
            };
          return (
            <OverlayCard
              key={overlay.id}
              overlay={overlay}
              state={state}
              onToggle={handleToggle}
              onOpacityCommit={handleOpacityCommit}
            />
          );
        })}
      </div>
    </div>
  );
}
