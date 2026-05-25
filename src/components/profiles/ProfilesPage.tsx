import { useCallback, useEffect, useState } from "react";
import { ProfileList } from "./ProfileList";
import { ProfileDetail } from "./ProfileDetail";
import { useProfiles } from "../../context/ProfileContext";
import { useLogs } from "../../context/LogContext";

export function ProfilesPage() {
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    updateProfile,
    addProfile,
    duplicateProfile,
    deleteProfile,
  } = useProfiles();
  const { addLog } = useLogs();
  const [selectedId, setSelectedId] = useState<string>(activeProfileId);

  useEffect(() => {
    if (!profiles.some((p) => p.id === selectedId)) {
      setSelectedId(profiles[0]?.id ?? activeProfileId);
    }
  }, [profiles, selectedId, activeProfileId]);

  const selected = profiles.find((p) => p.id === selectedId);

  const handleAdd = useCallback(() => {
    const created = addProfile();
    setSelectedId(created.id);
    addLog(`Profile created: ${created.name}`);
  }, [addProfile, addLog]);

  const handleActivate = useCallback(
    (id: string) => {
      setActiveProfileId(id);
      addLog(`Profile activated: ${id}`);
      // TODO(hiro): connect to Tauri backend — { cmd: "load_profile", id }
    },
    [setActiveProfileId, addLog],
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const copy = duplicateProfile(id);
      if (copy) {
        setSelectedId(copy.id);
        addLog(`Profile duplicated: ${copy.name}`);
      }
    },
    [duplicateProfile, addLog],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteProfile(id);
      addLog(`Profile deleted: ${id}`);
    },
    [deleteProfile, addLog],
  );

  return (
    <div className="px-8 py-8 grid gap-6 lg:grid-cols-[300px_1fr]">
      <ProfileList
        profiles={profiles}
        selectedId={selectedId}
        activeProfileId={activeProfileId}
        onSelect={setSelectedId}
        onAdd={handleAdd}
      />
      {selected ? (
        <ProfileDetail
          profile={selected}
          isActive={selected.id === activeProfileId}
          onUpdate={updateProfile}
          onActivate={handleActivate}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          canDelete={profiles.length > 1}
        />
      ) : (
        <div className="border border-[#222] bg-[#111] flex items-center justify-center">
          <span className="text-[11px] uppercase tracking-widest text-gray-600">
            No profile selected
          </span>
        </div>
      )}
    </div>
  );
}
