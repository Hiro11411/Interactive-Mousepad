import { memo } from "react";
import { ModelViewer } from "./ModelViewer";
import { SkinPreview } from "../SkinPreview";
import { useSkins } from "../../context/SkinContext";

export const DisplayPreview = memo(function DisplayPreview() {
  const { activeSkinId } = useSkins();

  return (
    <div className="px-8 pt-8 pb-4">
      <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">
        {activeSkinId ? "Skin Preview" : "Mousepad Preview"}
      </div>
      <div
        className="relative w-full bg-[#0A0A0A] border border-[#222]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="w-full h-full absolute inset-0">
          {activeSkinId ? (
            <SkinPreview skin={activeSkinId} />
          ) : (
            <ModelViewer />
          )}
        </div>
      </div>
    </div>
  );
});
