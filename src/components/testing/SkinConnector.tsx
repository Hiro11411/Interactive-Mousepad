import { memo, useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../shared/Button";
import { IconButton } from "../shared/IconButton";
import { useSkins } from "../../context/SkinContext";
import { useLogs } from "../../context/LogContext";
import type { SkinType } from "../../types";

const TYPE_OPTIONS: SkinType[] = ["interactive", "video", "static", "generative"];

export const SkinConnector = memo(function SkinConnector() {
  const { testSkins, registerTestSkin, removeTestSkin } = useSkins();
  const { addLog } = useLogs();

  const [executablePath, setExecutablePath] = useState("");
  const [skinId, setSkinId] = useState("");
  const [skinName, setSkinName] = useState("");
  const [skinType, setSkinType] = useState<SkinType>("interactive");

  const handleRegister = useCallback(() => {
    if (!skinId.trim() || !skinName.trim()) return;
    registerTestSkin({
      id: skinId.trim(),
      name: skinName.trim(),
      author: "Test",
      type: skinType,
      source: "test",
      executablePath: executablePath.trim() || undefined,
    });
    addLog(`Skin registered: ${skinId} (${skinType})`);
    // TODO(hiro): connect to Tauri backend — register Godot executable for IPC
    setExecutablePath("");
    setSkinId("");
    setSkinName("");
    setSkinType("interactive");
  }, [skinId, skinName, skinType, executablePath, registerTestSkin, addLog]);

  const canRegister = skinId.trim().length > 0 && skinName.trim().length > 0;

  return (
    <section className="border border-[#222] bg-[#111]">
      <header
        className="px-5 py-3 border-b border-[#222]
          text-[10px] uppercase tracking-widest text-gray-600"
      >
        Skin Connector
      </header>
      <div className="px-5 py-5 space-y-5">
        <div
          className="border border-dashed border-[#222] bg-[#0A0A0A]
            px-5 py-8 text-center"
        >
          {/* TODO(hiro): connect to Tauri backend — real drag/drop of Godot executable */}
          <div
            className="text-[10px] uppercase tracking-widest text-gray-600 mb-3"
          >
            Drag Godot Executable Here
          </div>
          <input
            type="text"
            value={executablePath}
            onChange={(e) => setExecutablePath(e.target.value)}
            placeholder="Or paste path: C:\skins\my-skin.exe"
            className="w-full border border-[#222] px-3 py-2 text-xs text-gray-300
              placeholder:text-gray-700 hover:border-[#333] focus:border-rose-600
              transition-colors duration-150 bg-transparent text-center"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label
              className="text-[10px] uppercase tracking-widest text-gray-600"
            >
              Skin ID
            </label>
            <input
              type="text"
              value={skinId}
              onChange={(e) => setSkinId(e.target.value)}
              placeholder="my-skin"
              className="w-full border border-[#222] px-3 py-2 text-xs text-white
                placeholder:text-gray-700 hover:border-[#333] focus:border-rose-600
                transition-colors duration-150"
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="text-[10px] uppercase tracking-widest text-gray-600"
            >
              Skin Name
            </label>
            <input
              type="text"
              value={skinName}
              onChange={(e) => setSkinName(e.target.value)}
              placeholder="My Skin"
              className="w-full border border-[#222] px-3 py-2 text-xs text-white
                placeholder:text-gray-700 hover:border-[#333] focus:border-rose-600
                transition-colors duration-150"
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="text-[10px] uppercase tracking-widest text-gray-600"
            >
              Type
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as SkinType)}
              className="w-full border border-[#222] px-3 py-2 text-xs text-white
                hover:border-[#333] focus:border-rose-600
                transition-colors duration-150 bg-[#0A0A0A]"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Button
            variant="primary"
            disabled={!canRegister}
            onClick={handleRegister}
          >
            Register Skin
          </Button>
        </div>

        {testSkins.length > 0 ? (
          <div className="border-t border-[#1A1A1A] pt-4">
            <div
              className="text-[10px] uppercase tracking-widest text-gray-600 mb-2"
            >
              Registered Test Skins
            </div>
            <div className="space-y-1.5">
              {testSkins.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3
                    border border-[#1A1A1A] px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-white truncate">{s.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-600">
                      {s.id} · {s.type}
                    </div>
                  </div>
                  <IconButton
                    title="Remove"
                    onClick={() => {
                      removeTestSkin(s.id);
                      addLog(`Test skin removed: ${s.id}`);
                    }}
                  >
                    <Trash2 strokeWidth={1.5} size={14} />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
});
