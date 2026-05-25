import { memo } from "react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  active?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
  children: ReactNode;
  onClick?: () => void;
}

const BASE =
  "px-4 py-2 text-[11px] uppercase tracking-widest transition-colors duration-150";

function variantClasses(variant: ButtonVariant, active: boolean): string {
  if (variant === "primary") {
    return active
      ? "border border-rose-600 bg-rose-600 text-white"
      : "border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white";
  }
  if (variant === "secondary") {
    return active
      ? "border border-rose-600 text-white"
      : "border border-[#222] text-gray-400 hover:border-[#333] hover:text-white";
  }
  return active
    ? "text-white"
    : "text-gray-500 hover:text-gray-300";
}

export const Button = memo(function Button({
  variant = "secondary",
  active = false,
  disabled = false,
  type = "button",
  title,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE} ${variantClasses(variant, active)}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
});
