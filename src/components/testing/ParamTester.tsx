import { memo, useCallback, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../shared/Button";
import { IconButton } from "../shared/IconButton";
import { Slider } from "../shared/Slider";
import { useLogs } from "../../context/LogContext";
import type { ParamType, TestParam } from "../../types";

const TYPES: ParamType[] = ["float", "int", "color", "bool"];

function makeId(): string {
  return `param-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

interface ParamRowProps {
  param: TestParam;
  onChange: (id: string, patch: Partial<TestParam>) => void;
  onRemove: (id: string) => void;
}

const ParamRow = memo(function ParamRow({ param, onChange, onRemove }: ParamRowProps) {
  const numericValue = Number(param.value);
  const showSlider = param.type === "float" || param.type === "int";

  return (
    <div
      className="grid items-center gap-3 px-4 py-3 border-b border-[#1A1A1A]
        last:border-b-0"
      style={{ gridTemplateColumns: "1fr 1.5fr 110px 32px" }}
    >
      <input
        type="text"
        value={param.name}
        onChange={(e) => onChange(param.id, { name: e.target.value })}
        placeholder="param-name"
        className="border border-[#222] px-3 py-1.5 text-xs text-white
          placeholder:text-gray-700 hover:border-[#333] focus:border-rose-600
          transition-colors duration-150"
      />
      <div className="flex items-center gap-3">
        {showSlider ? (
          <Slider
            value={Number.isFinite(numericValue) ? numericValue : 0}
            min={0}
            max={100}
            step={param.type === "int" ? 1 : 0.1}
            showValue={false}
            onChange={(v) =>
              onChange(param.id, {
                value: param.type === "int" ? String(Math.round(v)) : v.toFixed(1),
              })
            }
          />
        ) : null}
        <input
          type="text"
          value={param.value}
          onChange={(e) => onChange(param.id, { value: e.target.value })}
          placeholder="value"
          className="w-24 border border-[#222] px-2 py-1.5 text-xs text-white
            placeholder:text-gray-700 hover:border-[#333] focus:border-rose-600
            transition-colors duration-150 text-right tabular-nums"
        />
      </div>
      <select
        value={param.type}
        onChange={(e) => onChange(param.id, { type: e.target.value as ParamType })}
        className="border border-[#222] px-2 py-1.5 text-xs text-white
          hover:border-[#333] focus:border-rose-600
          transition-colors duration-150 bg-[#0A0A0A]"
      >
        {TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <IconButton title="Remove" onClick={() => onRemove(param.id)}>
        <Trash2 strokeWidth={1.5} size={14} />
      </IconButton>
    </div>
  );
});

export const ParamTester = memo(function ParamTester() {
  const [params, setParams] = useState<TestParam[]>([]);
  const { addLog } = useLogs();

  const handleAdd = useCallback(() => {
    setParams((list) => [
      ...list,
      { id: makeId(), name: `param_${list.length + 1}`, value: "0", type: "float" },
    ]);
  }, []);

  const handleChange = useCallback(
    (id: string, patch: Partial<TestParam>) => {
      setParams((list) => {
        const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
        const changed = next.find((p) => p.id === id);
        if (changed && "value" in patch) {
          addLog(`Param "${changed.name}" → ${changed.value} (${changed.type})`);
        }
        return next;
      });
      // TODO(hiro): connect to Tauri backend — { cmd: "set_param", key, value, type }
    },
    [addLog],
  );

  const handleRemove = useCallback(
    (id: string) => {
      setParams((list) => list.filter((p) => p.id !== id));
      addLog(`Param removed: ${id}`);
    },
    [addLog],
  );

  return (
    <section className="border border-[#222] bg-[#111]">
      <header
        className="px-5 py-3 border-b border-[#222]
          flex items-center justify-between"
      >
        <span className="text-[10px] uppercase tracking-widest text-gray-600">
          Parameter Tester
        </span>
        <Button onClick={handleAdd}>
          <span className="inline-flex items-center gap-2">
            <Plus strokeWidth={1.5} size={12} />
            Add Parameter
          </span>
        </Button>
      </header>
      <div>
        {params.length === 0 ? (
          <div
            className="px-5 py-6 text-[11px] uppercase tracking-widest text-gray-600"
          >
            No parameters defined
          </div>
        ) : (
          params.map((p) => (
            <ParamRow
              key={p.id}
              param={p}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </section>
  );
});
