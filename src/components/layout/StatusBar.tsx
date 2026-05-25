import { memo } from "react";
import { useProfiles } from "../../context/ProfileContext";
import { useDevice } from "../../context/DeviceContext";

export const StatusBar = memo(function StatusBar() {
  const { activeProfile } = useProfiles();
  const { connected, mock, firmware } = useDevice();

  const deviceLabel = connected
    ? "Connected"
    : mock
    ? "Simulation"
    : "Not Connected";

  const deviceColor = connected
    ? "text-rose-600"
    : mock
    ? "text-gray-300"
    : "text-gray-500";

  return (
    <footer
      className="h-8 border-t border-[#222] bg-[#0A0A0A]
        flex items-center text-[11px] uppercase tracking-widest"
    >
      <div className="flex-1 px-4 text-gray-500">
        <span className="text-gray-600">Profile:</span>{" "}
        <span className="text-gray-300">{activeProfile?.name ?? "—"}</span>
      </div>
      <div className="px-4 border-l border-[#222] text-gray-500">
        <span className="text-gray-600">Device:</span>{" "}
        <span className={deviceColor}>{deviceLabel}</span>
      </div>
      <div className="px-4 border-l border-[#222] text-gray-500">
        <span className="text-gray-600">FW:</span>{" "}
        <span className="text-gray-300">{firmware ?? "—"}</span>
      </div>
    </footer>
  );
});
