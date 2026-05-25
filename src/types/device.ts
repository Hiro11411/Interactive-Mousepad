export interface DeviceState {
  connected: boolean;
  mock: boolean;
  port: string | null;
  firmware: string | null;
}

export interface DeviceInfo {
  firmware: string;
  hardwareRev: string;
  displayResolution: string;
  freeStorage: string;
  temperature: string;
  uptime: string;
}
