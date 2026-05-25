import { memo } from "react";
import { Toggle } from "../shared/Toggle";
import { Button } from "../shared/Button";
import type { Plugin } from "../../types";

interface PluginRowProps {
  plugin: Plugin;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
}

export const PluginRow = memo(function PluginRow({
  plugin,
  onToggle,
  onConfigure,
}: PluginRowProps) {
  return (
    <div
      className={`border bg-[#111] transition-colors duration-150
        ${plugin.enabled ? "border-rose-600" : "border-[#222] hover:border-[#333]"}`}
    >
      <div className="px-5 py-4 flex items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-white">{plugin.name}</div>
          <div className="text-[11px] text-gray-500 mt-1">{plugin.description}</div>
        </div>
        {plugin.enabled ? (
          <Button onClick={() => onConfigure(plugin.id)}>Configure</Button>
        ) : null}
        <Toggle checked={plugin.enabled} onChange={() => onToggle(plugin.id)} />
      </div>
    </div>
  );
});
