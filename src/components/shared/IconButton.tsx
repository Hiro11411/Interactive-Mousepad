import { memo } from "react";
import type { ReactNode } from "react";

interface IconButtonProps {
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const IconButton = memo(function IconButton({
  active = false,
  disabled = false,
  title,
  children,
  onClick,
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 transition-colors duration-150
        ${active ? "text-white" : "text-gray-500 hover:text-white"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
});
