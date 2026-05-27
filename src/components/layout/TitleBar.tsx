import { memo, useCallback, useEffect, useState } from "react";
import { Minus, Square, Copy, X, EyeOff } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const TitleBar = memo(function TitleBar() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const win = getCurrentWindow();
    win.isMaximized().then(setMaximized).catch(() => {});
  }, []);

  const handleMinimize = useCallback(() => {
    getCurrentWindow().minimize().catch(() => {});
  }, []);

  const handleMaximize = useCallback(async () => {
    const win = getCurrentWindow();
    await win.toggleMaximize().catch(() => {});
    const isMax = await win.isMaximized().catch(() => false);
    setMaximized(!!isMax);
  }, []);

  const handleHide = useCallback(() => {
    getCurrentWindow().hide().catch(() => {});
  }, []);

  const handleClose = useCallback(() => {
    getCurrentWindow().close().catch(() => {});
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="drag-region flex items-center justify-between
        h-9 bg-[#0A0A0A] border-b border-[#222] select-none"
    >
      <div className="px-4 text-[11px] uppercase tracking-widest text-gray-400">
        The Sidepiece
      </div>
      <div className="no-drag flex h-full">
        <button
          type="button"
          onClick={handleMinimize}
          className="w-11 h-full flex items-center justify-center
            text-gray-500 hover:text-white hover:bg-[#1A1A1A]
            transition-colors duration-150"
          title="Minimize"
        >
          <Minus strokeWidth={1.5} size={14} />
        </button>
        <button
          type="button"
          onClick={handleHide}
          className="w-11 h-full flex items-center justify-center
            text-gray-500 hover:text-white hover:bg-[#1A1A1A]
            transition-colors duration-150"
          title="Hide to tray"
        >
          <EyeOff strokeWidth={1.5} size={14} />
        </button>
        <button
          type="button"
          onClick={handleMaximize}
          className="w-11 h-full flex items-center justify-center
            text-gray-500 hover:text-white hover:bg-[#1A1A1A]
            transition-colors duration-150"
          title={maximized ? "Restore" : "Maximize"}
        >
          {maximized ? (
            <Copy strokeWidth={1.5} size={12} />
          ) : (
            <Square strokeWidth={1.5} size={12} />
          )}
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="w-11 h-full flex items-center justify-center
            text-gray-500 hover:text-white hover:bg-rose-600
            transition-colors duration-150"
          title="Close"
        >
          <X strokeWidth={1.5} size={14} />
        </button>
      </div>
    </div>
  );
});
