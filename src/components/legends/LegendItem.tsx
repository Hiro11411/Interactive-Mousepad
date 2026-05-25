import { memo, useCallback, useRef } from "react";
import type { Legend } from "../../types";

interface LegendItemProps {
  legend: Legend;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string) => void;
  onDragChange: (id: string, x: number, y: number) => void;
  onDragCommit: (id: string, x: number, y: number) => void;
}

const COLOR_CLASS: Record<Legend["color"], string> = {
  white: "text-white",
  gray: "text-gray-400",
  rose: "text-rose-600",
};

export const LegendItem = memo(function LegendItem({
  legend,
  isSelected,
  containerRef,
  onSelect,
  onDragChange,
  onDragCommit,
}: LegendItemProps) {
  const draggingRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const latestRef = useRef<{ x: number; y: number }>({ x: legend.x, y: legend.y });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      const drag = draggingRef.current;
      if (!container || !drag) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left - drag.offsetX) / rect.width) * 100;
      const y = ((e.clientY - rect.top - drag.offsetY) / rect.height) * 100;
      const clamped = { x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) };
      latestRef.current = clamped;
      onDragChange(legend.id, clamped.x, clamped.y);
    },
    [containerRef, legend.id, onDragChange],
  );

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    onDragCommit(legend.id, latestRef.current.x, latestRef.current.y);
  }, [handleMouseMove, legend.id, onDragCommit]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(legend.id);
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      draggingRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
      latestRef.current = { x: legend.x, y: legend.y };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp, legend.id, legend.x, legend.y, onSelect],
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${legend.x}%`,
        top: `${legend.y}%`,
        fontSize: `${legend.fontSize}px`,
        opacity: legend.opacity / 100,
      }}
      className={`px-2 py-1 cursor-move select-none uppercase tracking-widest
        ${COLOR_CLASS[legend.color]}
        ${isSelected ? "outline outline-1 outline-rose-600" : ""}`}
    >
      {legend.text || "EMPTY"}
    </div>
  );
});
