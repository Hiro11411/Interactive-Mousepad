import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "../constants";
import { DEFAULT_PROFILES } from "../data/profiles";
import type { Profile } from "../types";
import { loadFromStorage, usePersist } from "./persist";

interface PersistedState {
  profiles: Profile[];
  activeProfileId: string;
}

interface ProfileContextValue extends PersistedState {
  activeProfile: Profile | undefined;
  setActiveProfileId: (id: string) => void;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  addProfile: () => Profile;
  duplicateProfile: (id: string) => Profile | undefined;
  deleteProfile: (id: string) => void;
}

const DEFAULT_STATE: PersistedState = {
  profiles: DEFAULT_PROFILES,
  activeProfileId: "default",
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function makeId(): string {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() =>
    loadFromStorage(STORAGE_KEYS.profile, DEFAULT_STATE),
  );

  usePersist(STORAGE_KEYS.profile, state);

  const setActiveProfileId = useCallback((activeProfileId: string) => {
    setState((s) => ({ ...s, activeProfileId }));
  }, []);

  const updateProfile = useCallback((id: string, patch: Partial<Profile>) => {
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const addProfile = useCallback((): Profile => {
    const next: Profile = {
      id: makeId(),
      name: "New Profile",
      skin: null,
      brightness: 80,
      speed: 50,
    };
    setState((s) => ({ ...s, profiles: [...s.profiles, next] }));
    return next;
  }, []);

  const duplicateProfile = useCallback((id: string): Profile | undefined => {
    let created: Profile | undefined;
    setState((s) => {
      const src = s.profiles.find((p) => p.id === id);
      if (!src) return s;
      created = { ...src, id: makeId(), name: `${src.name} Copy` };
      return { ...s, profiles: [...s.profiles, created] };
    });
    return created;
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState((s) => {
      if (s.profiles.length <= 1) return s;
      const profiles = s.profiles.filter((p) => p.id !== id);
      const activeProfileId =
        s.activeProfileId === id ? profiles[0].id : s.activeProfileId;
      return { profiles, activeProfileId };
    });
  }, []);

  const value = useMemo<ProfileContextValue>(() => {
    const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);
    return {
      ...state,
      activeProfile,
      setActiveProfileId,
      updateProfile,
      addProfile,
      duplicateProfile,
      deleteProfile,
    };
  }, [state, setActiveProfileId, updateProfile, addProfile, duplicateProfile, deleteProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfiles must be used within ProfileProvider");
  return ctx;
}
