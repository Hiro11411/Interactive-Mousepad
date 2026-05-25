import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PAGES, STORAGE_KEYS } from "../constants";
import type { PageId } from "../constants";
import { loadFromStorage, usePersist } from "./persist";

interface NavigationContextValue {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

function isPageId(value: unknown): value is PageId {
  return typeof value === "string" && (PAGES as readonly string[]).includes(value);
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<PageId>(() => {
    const stored = loadFromStorage<unknown>(STORAGE_KEYS.navigation, "display");
    return isPageId(stored) ? stored : "display";
  });

  usePersist(STORAGE_KEYS.navigation, activePage);

  const value = useMemo(
    () => ({ activePage, setActivePage }),
    [activePage],
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
