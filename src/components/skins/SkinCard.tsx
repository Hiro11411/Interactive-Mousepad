import { memo } from "react";
import type { Skin } from "../../types";

interface SkinCardProps {
  skin: Skin;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const SkinCard = memo(function SkinCard({
  skin,
  isActive,
  onSelect,
}: SkinCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(skin.id)}
      className={`text-left bg-[#111] border transition-colors duration-150
        ${isActive
          ? "border-rose-600"
          : "border-[#222] hover:border-[#333]"}`}
    >
      <div
        className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A]"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* TODO(hiro): connect to Tauri backend — render skin thumbnail */}
      </div>
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-white truncate">{skin.name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5 truncate">
            {skin.author}
          </div>
        </div>
        <span
          className="text-[10px] uppercase tracking-widest text-rose-600 shrink-0"
        >
          {skin.type}
        </span>
      </div>
    </button>
  );
});
