import { memo } from "react";
import { Plus } from "lucide-react";
import { Button } from "../shared/Button";
import type { Profile } from "../../types";

interface ProfileListProps {
  profiles: Profile[];
  selectedId: string | null;
  activeProfileId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  selectedId,
  activeProfileId,
  onSelect,
  onAdd,
}: ProfileListProps) {
  return (
    <aside
      className="border border-[#222] bg-[#111] flex flex-col"
    >
      <header
        className="px-5 py-3 border-b border-[#222]
          text-[10px] uppercase tracking-widest text-gray-600"
      >
        Profiles
      </header>
      <div className="flex-1 overflow-y-auto">
        {profiles.map((p) => {
          const isSelected = p.id === selectedId;
          const isActive = p.id === activeProfileId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={`w-full flex items-center justify-between gap-3
                px-5 py-3 border-b border-[#1A1A1A] last:border-b-0
                text-left transition-colors duration-150
                ${isSelected ? "bg-[#0E0E0E]" : "hover:bg-[#0E0E0E]"}`}
            >
              <span
                className={`text-xs uppercase tracking-widest
                  ${isSelected ? "text-white" : "text-gray-400"}`}
              >
                {p.name}
              </span>
              {isActive ? (
                <span className="w-1.5 h-1.5 bg-rose-600 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t border-[#222]">
        <Button variant="primary" onClick={onAdd}>
          <span className="inline-flex items-center gap-2">
            <Plus strokeWidth={1.5} size={12} />
            New Profile
          </span>
        </Button>
      </div>
    </aside>
  );
});
