export function SystemStatsPanel() {
  const metrics = [
    { label: "CPU Usage", value: "—" },
    { label: "CPU Temp", value: "—" },
    { label: "GPU Usage", value: "—" },
    { label: "GPU Temp", value: "—" },
    { label: "RAM Usage", value: "—" },
    { label: "RAM Available", value: "—" },
  ];

  return (
    <section className="border border-[#222] bg-[#111]">
      <header className="px-5 py-3 border-b border-[#222] text-[10px] uppercase tracking-widest text-gray-600">
        System Stats
      </header>
      <dl className="px-5 py-5 grid grid-cols-2 gap-x-8 gap-y-4">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-[10px] uppercase tracking-widest text-gray-600">
              {label}
            </dt>
            <dd className="text-xs text-gray-300 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
