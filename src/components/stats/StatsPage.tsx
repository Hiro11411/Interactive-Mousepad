import { SystemStatsPanel } from "./SystemStatsPanel";
import { MouseHeatmapPanel } from "./MouseHeatmapPanel";

export function StatsPage() {
  return (
    <div className="px-8 py-8 max-w-5xl space-y-6">
      <header>
        <h2 className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
          Stats
        </h2>
        <p className="text-xs text-gray-600">
          System performance and mouse activity data
        </p>
      </header>

      <SystemStatsPanel />
      <MouseHeatmapPanel />
    </div>
  );
}
