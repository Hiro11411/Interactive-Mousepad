export type SkinType = "interactive" | "video" | "static" | "generative";

export interface Skin {
  id: string;
  name: string;
  author: string;
  type: SkinType;
  source?: "builtin" | "test";
  executablePath?: string;
}
