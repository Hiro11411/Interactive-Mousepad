export type LegendColor = "white" | "gray" | "rose";

export interface Legend {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: LegendColor;
  opacity: number;
}
