import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import { PLACEHOLDER_SKINS } from "../data/skins";
import type { Skin } from "../types";
import { loadFromStorage, usePersist } from "./persist";

interface SkinContextValue {
  builtinSkins: Skin[];
  testSkins: Skin[];
  allSkins: Skin[];
  activeSkinId: string | null;
  setActiveSkinId: (id: string | null) => void;
  registerTestSkin: (skin: Skin) => void;
  removeTestSkin: (id: string) => void;
}

interface PersistedState {
  testSkins: Skin[];
  activeSkinId: string | null;
}

const DEFAULT_STATE: PersistedState = {
  testSkins: [],
  activeSkinId: null,
};

const SkinContext = createContext<SkinContextValue | null>(null);

export function SkinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() =>
    loadFromStorage(STORAGE_KEYS.skin, DEFAULT_STATE),
  );

  usePersist(STORAGE_KEYS.skin, state);

  const setActiveSkinId = useCallback((activeSkinId: string | null) => {
    setState((s) => ({ ...s, activeSkinId }));
  }, []);

  const registerTestSkin = useCallback((skin: Skin) => {
    setState((s) => {
      const exists = s.testSkins.some((t) => t.id === skin.id);
      if (exists) {
        return {
          ...s,
          testSkins: s.testSkins.map((t) => (t.id === skin.id ? skin : t)),
        };
      }
      return { ...s, testSkins: [...s.testSkins, skin] };
    });
  }, []);

  const removeTestSkin = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      testSkins: s.testSkins.filter((t) => t.id !== id),
      activeSkinId: s.activeSkinId === id ? null : s.activeSkinId,
    }));
  }, []);

  const value = useMemo<SkinContextValue>(() => {
    const allSkins = [...PLACEHOLDER_SKINS, ...state.testSkins];
    return {
      builtinSkins: PLACEHOLDER_SKINS,
      testSkins: state.testSkins,
      allSkins,
      activeSkinId: state.activeSkinId,
      setActiveSkinId,
      registerTestSkin,
      removeTestSkin,
    };
  }, [state, setActiveSkinId, registerTestSkin, removeTestSkin]);

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkins(): SkinContextValue {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error("useSkins must be used within SkinProvider");
  return ctx;
}
