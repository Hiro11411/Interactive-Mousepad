export type { Skin, SkinType } from "./skin";
export type { Overlay, OverlayState } from "./overlay";
export type { Legend, LegendColor } from "./legend";
export type { Plugin } from "./plugin";
export type { Profile } from "./profile";
export type { DeviceState, DeviceInfo } from "./device";
export type { Layer } from "./layer";

export type ParamType = "float" | "int" | "color" | "bool";

export interface TestParam {
  id: string;
  name: string;
  value: string;
  type: ParamType;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}
