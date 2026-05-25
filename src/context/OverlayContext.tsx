import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import { PLACEHOLDER_OVERLAYS } from "../data/overlays";
import type { OverlayState } from "../types";
import { loadFromStorage, usePersist } from "./persist";

interface OverlayContextValue {
  overlays: OverlayState[];
  toggleOverlay: (id: string) => void;
  setOverlayOpacity: (id: string, opacity: number) => void;
}

const DEFAULT_OVERLAYS: OverlayState[] = PLACEHOLDER_OVERLAYS.map((o) => ({
  id: o.id,
  enabled: false,
  opacity: 100,
}));

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlays, setOverlays] = useState<OverlayState[]>(() =>
    loadFromStorage(STORAGE_KEYS.overlay, DEFAULT_OVERLAYS),
  );

  usePersist(STORAGE_KEYS.overlay, overlays);

  const toggleOverlay = useCallback((id: string) => {
    setOverlays((list) =>
      list.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)),
    );
  }, []);

  const setOverlayOpacity = useCallback((id: string, opacity: number) => {
    setOverlays((list) =>
      list.map((o) => (o.id === id ? { ...o, opacity } : o)),
    );
  }, []);

  const value = useMemo(
    () => ({ overlays, toggleOverlay, setOverlayOpacity }),
    [overlays, toggleOverlay, setOverlayOpacity],
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlays(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlays must be used within OverlayProvider");
  return ctx;
}
