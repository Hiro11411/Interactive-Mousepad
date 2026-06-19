import { useCallback, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../shared/Button";
import { MockToggle } from "./MockToggle";
import { useDevice } from "../../context/DeviceContext";
import { useLogs } from "../../context/LogContext";
import type { DeviceInfo } from "../../types";

type ConnectionStatus = "unknown" | "connected" | "disconnected";

const MOCK_INFO: DeviceInfo = {
  firmware: "1.0.0-mock",
  hardwareRev: "Rev A",
  displayResolution: "1920 × 1080",
  freeStorage: "12.4 GB",
  temperature: "47 °C",
  uptime: "00:24:18",
};

const EMPTY_INFO: DeviceInfo = {
  firmware: "—",
  hardwareRev: "—",
  displayResolution: "—",
  freeStorage: "—",
  temperature: "—",
  uptime: "—",
};

export function DevicePanel() {
  const { connected, mock, port, setConnected } = useDevice();
  const { addLog } = useLogs();
  const [checkStatus, setCheckStatus] = useState<ConnectionStatus>("unknown");

  const info = useMemo<DeviceInfo>(() => {
    if (connected || mock) return MOCK_INFO;
    return EMPTY_INFO;
  }, [connected, mock]);

  const handleConnect = useCallback(() => {
    if (connected) {
      setConnected(false);
      addLog(`Disconnected from ${port ?? "device"}`);
      // TODO(hiro): connect to Tauri backend — invoke("disconnect_device")
    } else {
      setConnected(true);
      addLog(`Connected${port ? ` to ${port}` : ""}`);
      // TODO(hiro): connect to Tauri backend — invoke("connect_device", { port })
    }
  }, [connected, port, setConnected, addLog]);

  // TODO(hiro): implement connection check logic.
  // - addLog("Checking mousepad connection...")
  // - await invoke<boolean>("check_mousepad_connection")  // TODO(hiro): confirm command name
  // - setCheckStatus("connected" | "disconnected") and addLog the outcome
  // - wrap in try/catch and addLog the failure
  const handleCheckConnection = useCallback(async () => {
    // your logic here
    void invoke;
  }, [addLog]);

  const statusColor = connected ? "text-rose-600" : "text-gray-500";
  const statusLabel = connected ? "Connected" : "Not Connected";

  const checkDot =
    checkStatus === "connected"
      ? "bg-green-500"
      : checkStatus === "disconnected"
        ? "bg-red-500"
        : "bg-gray-700";

  const checkText =
    checkStatus === "connected"
      ? "text-green-500"
      : checkStatus === "disconnected"
        ? "text-red-500"
        : "text-gray-500";

  const checkLabel =
    checkStatus === "connected"
      ? "Mousepad Connected"
      : checkStatus === "disconnected"
        ? "Mousepad Not Connected"
        : "Not Checked";

  return (
    <div className="px-8 py-8 max-w-3xl space-y-6">
      <header>
        <h2
          className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
        >
          Device
        </h2>
        <p className="text-xs text-gray-600">
          Connect to a physical mousepad over USB
        </p>
      </header>

      <section className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600"
        >
          Connection
        </header>
        <div className="px-5 py-5 space-y-5">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 ${connected ? "bg-rose-600" : "bg-gray-700"}`}
            />
            <span
              className={`text-[11px] uppercase tracking-widest ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleConnect}>
              {connected ? "Disconnect" : "Connect"}
            </Button>
            <Button onClick={handleCheckConnection}>
              Check Mousepad Connection
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${checkDot}`} />
            <span
              className={`text-[10px] uppercase tracking-widest ${checkText}`}
            >
              {checkLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600"
        >
          Device Info
        </header>
        <dl className="px-5 py-5 grid grid-cols-2 gap-x-8 gap-y-4">
          {[
            ["Firmware", info.firmware],
            ["Hardware Rev", info.hardwareRev],
            ["Display Resolution", info.displayResolution],
            ["Free Storage", info.freeStorage],
            ["Temperature", info.temperature],
            ["Uptime", info.uptime],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-widest text-gray-600">
                {label}
              </dt>
              <dd className="text-xs text-gray-300 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <MockToggle />
    </div>
  );
}
