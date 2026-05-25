import { memo, useEffect, useRef } from "react";
import { Button } from "../shared/Button";
import { useLogs } from "../../context/LogContext";

export const DebugConsole = memo(function DebugConsole() {
  const { logs, clearLogs } = useLogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <section className="border border-[#222] bg-[#111]">
      <header
        className="px-5 py-3 border-b border-[#222]
          flex items-center justify-between"
      >
        <span className="text-[10px] uppercase tracking-widest text-gray-600">
          Debug Console
        </span>
        <Button variant="ghost" onClick={clearLogs}>
          Clear
        </Button>
      </header>
      <div
        ref={scrollRef}
        className="bg-[#0A0A0A] h-64 overflow-y-auto px-4 py-3
          font-mono text-[11px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <div className="text-gray-700">No log entries</div>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className="text-gray-400">
              <span className="text-gray-700">[{entry.timestamp}]</span>{" "}
              {entry.message}
            </div>
          ))
        )}
      </div>
    </section>
  );
});
