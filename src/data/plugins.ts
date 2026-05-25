import type { Plugin } from "../types";

// PLACEHOLDER — replace with real data
export const PLACEHOLDER_PLUGINS: Plugin[] = [
  {
    id: "game-detector",
    name: "Game Detector",
    description: "Auto-switch profiles based on active application",
    enabled: true,
  },
  {
    id: "audio-visualizer",
    name: "Audio Visualizer",
    description: "Feed system audio to reactive skins",
    enabled: false,
  },
  {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "Display timer on overlay, shift colors on break",
    enabled: false,
  },
];
