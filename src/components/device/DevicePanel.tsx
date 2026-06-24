import { useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../shared/Button";
import { DebugConsole } from "../testing/DebugConsole";
import { useDevice } from "../../context/DeviceContext";
import { useLogs } from "../../context/LogContext";

type ConnectionStatus = "unknown" | "connected" | "disconnected";

export function DevicePanel() {
  const { connected, port, setConnected, setPort } = useDevice();
  const { addLog } = useLogs();
  const [checkStatus, setCheckStatus] = useState<ConnectionStatus>("unknown");

  const handleConnect = useCallback(async () => {
    if (connected) {
      try {
        await invoke("device_disconnected");
        setConnected(false);
        addLog("Disconnected");
      } catch (err) {
        addLog(`Disconnect failed: ${err}`);
      }
    } else {
      try {
        addLog("Scanning for serial devices...");
        const ports = await invoke<string[]>("scan_devices_serial");
        if (ports.length === 0) {
          addLog("No serial devices found");
          setCheckStatus("disconnected");
          return;
        }
        const foundPort = ports[0];
        setPort(foundPort);
        addLog(`Found port: ${foundPort}`);
        await invoke("device_connected", { port: foundPort });
        setConnected(true);
        addLog("Connected");
        setCheckStatus("connected");
      } catch (err) {
        addLog(`Connection failed: ${err}`);
        setCheckStatus("disconnected");
      }
    }
  }, [connected, setConnected, setPort, addLog]);

  //Handle check in logic - kept for reference
  const handleCheckConnection = useCallback(async () => {
    addLog("Scanning for serial devices...");
    try {
      //only allowing for serial connection
      const ports = await invoke<string[]>("scan_devices_serial")
      if (ports.length === 0) {
        addLog("No serial devices found");
        setCheckStatus("disconnected");
      } else {
        ports.forEach(p => addLog(p));
      }
    } catch (err) {
      addLog(`Serial scan has failed due to ${err}`);
      setCheckStatus("disconnected");
    }
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

      <DebugConsole />
    </div>
  );
}
