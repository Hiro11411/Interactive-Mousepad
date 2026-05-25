import { memo, useCallback } from "react";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}

export const Slider = memo(function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueSuffix = "%",
  onChange,
  onChangeEnd,
}: SliderProps) {
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    },
    [onChange],
  );

  const commit = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      onChangeEnd?.(Number((e.target as HTMLInputElement).value));
    },
    [onChangeEnd],
  );

  return (
    <div className="flex items-center gap-4 w-full">
      {label ? (
        <span
          className="text-[11px] uppercase tracking-widest text-gray-500
            min-w-[80px]"
        >
          {label}
        </span>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleInput}
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
        className="flex-1"
      />
      {showValue ? (
        <span className="text-xs text-gray-400 min-w-[44px] text-right tabular-nums">
          {Math.round(value)}
          {valueSuffix}
        </span>
      ) : null}
    </div>
  );
});
