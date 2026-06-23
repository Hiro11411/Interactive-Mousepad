import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import type { DeviceState } from "../types";
import { loadFromStorage, usePersist } from "./persist";

interface DeviceContextValue extends DeviceState {
  setConnected: (connected: boolean) => void;
  setPort: (port: string | null) => void;
  setFirmware: (firmware: string | null) => void;
}

const DEFAULT_STATE: DeviceState = {
  connected: false,
  port: null,
  firmware: null,
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeviceState>(() =>
    loadFromStorage(STORAGE_KEYS.device, DEFAULT_STATE),
  );

  usePersist(STORAGE_KEYS.device, state);

  const setConnected = useCallback((connected: boolean) => {
    setState((s) => ({ ...s, connected }));
  }, []);

  const setPort = useCallback((port: string | null) => {
    setState((s) => ({ ...s, port }));
  }, []);

  const setFirmware = useCallback((firmware: string | null) => {
    setState((s) => ({ ...s, firmware }));
  }, []);

  const value = useMemo(
    () => ({ ...state, setConnected, setPort, setFirmware }),
    [state, setConnected, setPort, setFirmware],
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used within DeviceProvider");
  return ctx;
}
