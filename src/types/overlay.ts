export interface Overlay {
  id: string;
  name: string;
  description: string;
}

export interface OverlayState {
  id: string;
  enabled: boolean;
  opacity: number;
}
