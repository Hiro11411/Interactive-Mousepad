import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import { loadFromStorage, usePersist } from "./persist";

// Holds committed display values. Sliders read these on mount and write back
// only on drag end — they never write to this context during a drag.
interface DisplayState {
  brightness: number;
  speed: number;
  displayOn: boolean;
  hueShift: boolean;
  rotation: number;
}

interface DisplayContextValue extends DisplayState {
  setBrightness: (v: number) => void;
  setSpeed: (v: number) => void;
  setDisplayOn: (v: boolean) => void;
  setHueShift: (v: boolean) => void;
  setRotation: (v: number) => void;
}

const DEFAULT_STATE: DisplayState = {
  brightness: 80,
  speed: 50,
  displayOn: true,
  hueShift: false,
  rotation: 0,
};

const DisplayContext = createContext<DisplayContextValue | null>(null);

export function DisplayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DisplayState>(() =>
    loadFromStorage(STORAGE_KEYS.display, DEFAULT_STATE),
  );

  usePersist(STORAGE_KEYS.display, state);

  const setBrightness = useCallback((brightness: number) => {
    setState((s) => ({ ...s, brightness }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((s) => ({ ...s, speed }));
  }, []);

  const setDisplayOn = useCallback((displayOn: boolean) => {
    setState((s) => ({ ...s, displayOn }));
  }, []);

  const setHueShift = useCallback((hueShift: boolean) => {
    setState((s) => ({ ...s, hueShift }));
  }, []);

  const setRotation = useCallback((rotation: number) => {
    setState((s) => ({ ...s, rotation }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setBrightness,
      setSpeed,
      setDisplayOn,
      setHueShift,
      setRotation,
    }),
    [state, setBrightness, setSpeed, setDisplayOn, setHueShift, setRotation],
  );

  return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>;
}

export function useDisplay(): DisplayContextValue {
  const ctx = useContext(DisplayContext);
  if (!ctx) throw new Error("useDisplay must be used within DisplayProvider");
  return ctx;
}
