import { memo } from "react";
import { Button } from "../shared/Button";
import type { SkinType } from "../../types";

export type SkinFilter = "all" | SkinType;

const FILTERS: { id: SkinFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "interactive", label: "Interactive" },
  { id: "video", label: "Video" },
  { id: "static", label: "Static" },
  { id: "generative", label: "Generative" },
];

interface SkinFiltersProps {
  active: SkinFilter;
  onChange: (filter: SkinFilter) => void;
}

export const SkinFilters = memo(function SkinFilters({
  active,
  onChange,
}: SkinFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <Button
          key={f.id}
          variant="ghost"
          active={active === f.id}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
});
