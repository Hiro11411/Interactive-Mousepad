import { memo } from "react";

interface ToggleProps {
  checked: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
}

export const Toggle = memo(function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 transition-colors duration-150
          ${checked ? "bg-rose-600" : "bg-[#222]"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white transition-all duration-150
            ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
      {label ? (
        <span className="text-[11px] uppercase tracking-widest text-gray-400">
          {label}
        </span>
      ) : null}
    </label>
  );
});
