import { useEffect, useRef } from "react";
import { PERSIST_DEBOUNCE_MS } from "../constants";

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function usePersist(key: string, value: unknown): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // storage full or unavailable — ignore
      }
    }, PERSIST_DEBOUNCE_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [key, value]);
}
