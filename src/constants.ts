export const COLORS = {
  bg: "#0A0A0A",
  surface: "#111111",
  surfaceElevated: "#1A1A1A",
  border: "#222222",
  borderHover: "#333333",
  accent: "#E11D48",
} as const;

export const SIDEBAR_WIDTH_EXPANDED = 220;
export const SIDEBAR_WIDTH_COLLAPSED = 60;

export const STORAGE_KEYS = {
  device: "mp.device",
  display: "mp.display",
  profile: "mp.profile",
  skin: "mp.skin",
  overlay: "mp.overlay",
  layer: "mp.layer",
  navigation: "mp.navigation",

  sidebar: "mp.sidebar",
} as const;

export const PERSIST_DEBOUNCE_MS = 500;

export const PAGES = [
  "display",
  "skins",
  "stats",
  "profiles",
  "device",
  "testing",
] as const;

export type PageId = (typeof PAGES)[number];
