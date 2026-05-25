import type { Profile } from "../types";

export const DEFAULT_PROFILES: Profile[] = [
  { id: "default", name: "Default", skin: null, brightness: 80, speed: 50 },
  { id: "gaming", name: "Gaming", skin: null, brightness: 100, speed: 75 },
  { id: "ambient", name: "Ambient", skin: null, brightness: 40, speed: 20 },
];
