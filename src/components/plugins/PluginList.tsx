import { useCallback, useState } from "react";
import { PluginRow } from "./PluginRow";
import { PLACEHOLDER_PLUGINS } from "../../data/plugins";
import { STORAGE_KEYS } from "../../constants";
import { loadFromStorage, usePersist } from "../../context/persist";
import { useLogs } from "../../context/LogContext";
import type { Plugin } from "../../types";

export function PluginList() {
  const [plugins, setPlugins] = useState<Plugin[]>(() =>
    loadFromStorage<Plugin[]>(STORAGE_KEYS.plugin, PLACEHOLDER_PLUGINS),
  );
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const { addLog } = useLogs();

  usePersist(STORAGE_KEYS.plugin, plugins);

  const handleToggle = useCallback(
    (id: string) => {
      setPlugins((list) =>
        list.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
      );
      addLog(`Plugin toggled: ${id}`);
      // TODO(hiro): connect to Tauri backend — { cmd: "toggle_plugin", id }
    },
    [addLog],
  );

  const handleConfigure = useCallback(
    (id: string) => {
      setConfiguringId((prev) => (prev === id ? null : id));
      addLog(`Plugin configure: ${id}`);
    },
    [addLog],
  );

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h2
          className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
        >
          Plugins
        </h2>
        <p className="text-xs text-gray-600">
          Extend functionality with optional integrations
        </p>
      </header>
      <div className="space-y-3">
        {plugins.map((plugin) => (
          <div key={plugin.id}>
            <PluginRow
              plugin={plugin}
              onToggle={handleToggle}
              onConfigure={handleConfigure}
            />
            {configuringId === plugin.id ? (
              <div
                className="border-x border-b border-[#222] bg-[#0E0E0E] px-5 py-6
                  text-[11px] uppercase tracking-widest text-gray-600"
              >
                {/* TODO(hiro): connect to Tauri backend — render per-plugin config UI */}
                Plugin configuration will go here
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
