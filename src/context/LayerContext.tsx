import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import type { Layer } from "../types";
import { loadFromStorage, usePersist } from "./persist";

interface LayerContextValue {
  layers: Layer[];
  reorderLayers: (next: Layer[]) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  toggleLayerVisible: (id: string) => void;
}

const DEFAULT_LAYERS: Layer[] = [
  { id: "reactive", name: "Reactive Layer", opacity: 100, visible: true },
  { id: "overlay-stats", name: "Overlay: Stats", opacity: 60, visible: true },
  { id: "base-skin", name: "Base Skin", opacity: 100, visible: true },
];

const LayerContext = createContext<LayerContextValue | null>(null);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>(() =>
    loadFromStorage(STORAGE_KEYS.layer, DEFAULT_LAYERS),
  );

  usePersist(STORAGE_KEYS.layer, layers);

  const reorderLayers = useCallback((next: Layer[]) => {
    setLayers(next);
  }, []);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((list) =>
      list.map((l) => (l.id === id ? { ...l, opacity } : l)),
    );
  }, []);

  const toggleLayerVisible = useCallback((id: string) => {
    setLayers((list) =>
      list.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    );
  }, []);

  const value = useMemo(
    () => ({ layers, reorderLayers, setLayerOpacity, toggleLayerVisible }),
    [layers, reorderLayers, setLayerOpacity, toggleLayerVisible],
  );

  return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

export function useLayers(): LayerContextValue {
  const ctx = useContext(LayerContext);
  if (!ctx) throw new Error("useLayers must be used within LayerProvider");
  return ctx;
}
