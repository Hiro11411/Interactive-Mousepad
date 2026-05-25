import { memo } from "react";
import { useSkins } from "../../context/SkinContext";
import { useDisplay } from "../../context/DisplayContext";

export const DisplayPreview = memo(function DisplayPreview() {
  const { allSkins, activeSkinId } = useSkins();
  const { displayOn } = useDisplay();

  const activeSkin = allSkins.find((s) => s.id === activeSkinId);

  return (
    <div className="px-8 pt-8 pb-4">
      <div
        className="text-[10px] uppercase tracking-widest text-gray-600 mb-3"
      >
        Mousepad Preview
      </div>
      <div
        className="relative w-full bg-[#0A0A0A] border border-[#222]
          flex items-center justify-center"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* TODO(hiro): connect to Tauri backend — Godot will render into this surface */}
        {!displayOn ? (
          <span
            className="text-[11px] uppercase tracking-widest text-gray-700"
          >
            Display Off
          </span>
        ) : activeSkin ? (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-600" />
            <span className="text-[11px] uppercase tracking-widest text-gray-400">
              Skin Active: {activeSkin.name}
            </span>
          </div>
        ) : (
          <span
            className="text-[11px] uppercase tracking-widest text-gray-600"
          >
            No Skin Loaded
          </span>
        )}
      </div>
    </div>
  );
});
