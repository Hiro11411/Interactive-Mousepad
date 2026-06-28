import { memo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Trash2 } from "lucide-react";
import type { Skin } from "../../types";

interface SkinCardProps {
  skin: Skin;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SkinCard = memo(function SkinCard({
  skin,
  isActive,
  onSelect,
  onDelete,
}: SkinCardProps) {
  const [pressed, setPressed] = useState(false);

  // only uploaded/test skins can be deleted — built-ins are protected
  const canDelete = skin.source === "test" && onDelete;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(skin.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(skin.id)}
      onKeyDown={handleKeyDown}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`group relative text-left bg-[#111] border transition-all duration-200 cursor-pointer
        ${isActive
          ? "border-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.25)]"
          : "border-[#222] hover:border-[#444]"}
        ${pressed ? "scale-[0.98]" : ""}`}
    >
      <div
        className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A] overflow-hidden"
        style={{ aspectRatio: "16 / 9" }}
      >
        <img
          src={`/skins/${skin.id}/preview.png`}
          alt={skin.name}
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
        />
      </div>

      {canDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don't trigger card select
            onDelete?.(skin.id);
          }}
          title="Delete skin"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center
            bg-black/70 text-gray-300 opacity-0 group-hover:opacity-100
            hover:text-white hover:bg-rose-600 transition-all duration-150"
        >
          <Trash2 strokeWidth={1.5} size={14} />
        </button>
      ) : null}
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
    </div>
  );
});
