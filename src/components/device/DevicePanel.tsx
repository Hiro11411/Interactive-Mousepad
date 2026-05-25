import { useCallback, useMemo, useState } from "react";
import { Button } from "../shared/Button";
import { MockToggle } from "./MockToggle";
import { useDevice } from "../../context/DeviceContext";
import { useLogs } from "../../context/LogContext";
import type { DeviceInfo } from "../../types";

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
  const { connected, mock, port, setConnected, setPort } = useDevice();
  const { addLog } = useLogs();
  const [scannedPorts] = useState<string[]>([]); // PLACEHOLDER — populated by backend later

  const info = useMemo<DeviceInfo>(() => {
    if (connected || mock) return MOCK_INFO;
    return EMPTY_INFO;
  }, [connected, mock]);

  const handleScan = useCallback(() => {
    addLog("Scanning for devices...");
    // TODO(hiro): connect to Tauri backend — invoke("list_serial_ports")
  }, [addLog]);

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

  const statusColor = connected ? "text-rose-600" : "text-gray-500";
  const statusLabel = connected ? "Connected" : "Not Connected";

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
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <select
              value={port ?? ""}
              onChange={(e) => setPort(e.target.value || null)}
              className="border border-[#222] px-3 py-2 text-xs text-gray-300
                hover:border-[#333] focus:border-rose-600
                transition-colors duration-150 bg-[#0A0A0A]"
            >
              <option value="">No port selected</option>
              {scannedPorts.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Button onClick={handleScan}>Scan for Device</Button>
          </div>
          <div>
            <Button variant="primary" onClick={handleConnect}>
              {connected ? "Disconnect" : "Connect"}
            </Button>
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
