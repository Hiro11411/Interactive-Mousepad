import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LogEntry } from "../types";

interface LogContextValue {
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

const MAX_LOGS = 500;

const LogContext = createContext<LogContextValue | null>(null);

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "init-0", timestamp: timestamp(), message: "Waiting for device connection..." },
    { id: "init-1", timestamp: timestamp(), message: "Mock mode inactive" },
  ]);
  const counterRef = useRef(0);

  const addLog = useCallback((message: string) => {
    counterRef.current += 1;
    const entry: LogEntry = {
      id: `log-${Date.now()}-${counterRef.current}`,
      timestamp: timestamp(),
      message,
    };
    setLogs((prev) => {
      const next = [...prev, entry];
      if (next.length > MAX_LOGS) next.splice(0, next.length - MAX_LOGS);
      return next;
    });
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const value = useMemo(
    () => ({ logs, addLog, clearLogs }),
    [logs, addLog, clearLogs],
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLogs(): LogContextValue {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error("useLogs must be used within LogProvider");
  return ctx;
}
