export function MouseHeatmapPanel() {
  return (
    <section className="border border-[#222] bg-[#111]">
      <header className="px-5 py-3 border-b border-[#222] text-[10px] uppercase tracking-widest text-gray-600">
        Mouse Heatmap
      </header>
      <div className="px-5 py-6 space-y-5">
        <div
          className="w-full border border-[#222] bg-[#0A0A0A] flex items-center justify-center"
          style={{ aspectRatio: "16 / 9", minHeight: "400px" }}
        >
          <span className="text-[11px] uppercase tracking-widest text-gray-700">
            Heatmap data not available
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Clicks", value: "—" },
            { label: "Distance Traveled", value: "—" },
            { label: "Active Time", value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#222] bg-[#0A0A0A] px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">
                {label}
              </div>
              <div className="text-sm text-gray-300 tabular-nums">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
