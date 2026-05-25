import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "../shared/Button";
import { Slider } from "../shared/Slider";
import { useSkins } from "../../context/SkinContext";
import { useOverlays } from "../../context/OverlayContext";
import { useLogs } from "../../context/LogContext";
import type { Profile } from "../../types";

interface ProfileDetailProps {
  profile: Profile;
  isActive: boolean;
  onUpdate: (id: string, patch: Partial<Profile>) => void;
  onActivate: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export const ProfileDetail = memo(function ProfileDetail({
  profile,
  isActive,
  onUpdate,
  onActivate,
  onDuplicate,
  onDelete,
  canDelete,
}: ProfileDetailProps) {
  const { allSkins } = useSkins();
  const { overlays } = useOverlays();
  const { addLog } = useLogs();

  const [localBrightness, setLocalBrightness] = useState(profile.brightness);
  const [localSpeed, setLocalSpeed] = useState(profile.speed);

  useEffect(() => setLocalBrightness(profile.brightness), [profile.brightness]);
  useEffect(() => setLocalSpeed(profile.speed), [profile.speed]);

  const skinName = profile.skin
    ? allSkins.find((s) => s.id === profile.skin)?.name ?? profile.skin
    : "None";

  const activeOverlays = overlays.filter((o) => o.enabled);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${profile.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    addLog(`Profile exported: ${profile.name}`);
  }, [profile, addLog]);

  return (
    <section className="border border-[#222] bg-[#111] flex flex-col">
      <header
        className="px-5 py-3 border-b border-[#222]
          text-[10px] uppercase tracking-widest text-gray-600
          flex items-center justify-between"
      >
        <span>Profile Detail</span>
        {isActive ? (
          <span className="inline-flex items-center gap-2 text-rose-600">
            <span className="w-1.5 h-1.5 bg-rose-600" /> Active
          </span>
        ) : null}
      </header>

      <div className="px-5 py-5 space-y-5">
        <div className="space-y-1.5">
          <label
            className="text-[10px] uppercase tracking-widest text-gray-600"
          >
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onUpdate(profile.id, { name: e.target.value })}
            className="w-full border border-[#222] px-3 py-2 text-xs text-white
              hover:border-[#333] focus:border-rose-600
              transition-colors duration-150"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest text-gray-600">
              Assigned Skin
            </div>
            <div className="text-xs text-gray-300">{skinName}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest text-gray-600">
              Active Overlays
            </div>
            <div className="text-xs text-gray-300">
              {activeOverlays.length === 0
                ? "None"
                : activeOverlays.map((o) => o.id).join(", ")}
            </div>
          </div>
        </div>

        <Slider
          label="Brightness"
          value={localBrightness}
          onChange={setLocalBrightness}
          onChangeEnd={(v) => onUpdate(profile.id, { brightness: v })}
        />
        <Slider
          label="Speed"
          value={localSpeed}
          onChange={setLocalSpeed}
          onChangeEnd={(v) => onUpdate(profile.id, { speed: v })}
        />

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1A1A1A]">
          <Button
            variant="primary"
            disabled={isActive}
            onClick={() => onActivate(profile.id)}
          >
            Activate
          </Button>
          <Button onClick={() => onDuplicate(profile.id)}>Duplicate</Button>
          <Button onClick={handleExport}>Export JSON</Button>
          <Button
            disabled={!canDelete}
            onClick={() => onDelete(profile.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
});
