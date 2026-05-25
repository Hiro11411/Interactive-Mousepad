import { memo, useCallback } from "react";
import { Toggle } from "../shared/Toggle";
import { useDevice } from "../../context/DeviceContext";
import { useLogs } from "../../context/LogContext";

export const MockToggle = memo(function MockToggle() {
  const { mock, connected, setMock, setConnected, setFirmware } = useDevice();
  const { addLog } = useLogs();

  const handleToggle = useCallback(
    (next: boolean) => {
      setMock(next);
      addLog(next ? "Mock mode activated" : "Mock mode deactivated");
      if (next) {
        setFirmware("1.0.0-mock");
      } else {
        setFirmware(null);
        if (!connected) {
          setConnected(false);
        }
      }
      // TODO(hiro): connect to Tauri backend — toggle mock device emitter
    },
    [setMock, setConnected, setFirmware, connected, addLog],
  );

  return (
    <div
      className="border border-[#222] bg-[#111] px-5 py-4
        flex items-center justify-between gap-4"
    >
      <div>
        <div className="text-xs text-white">Simulation Mode</div>
        <div className="text-[11px] text-gray-500 mt-1">
          Pretend a device is connected with fake telemetry
        </div>
      </div>
      <Toggle checked={mock} onChange={handleToggle} />
    </div>
  );
});
