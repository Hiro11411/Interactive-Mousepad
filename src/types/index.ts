export type { Skin, SkinType } from "./skin";
export type { Overlay, OverlayState } from "./overlay";

export type { Profile } from "./profile";
export type { DeviceState, DeviceInfo } from "./device";


export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}
