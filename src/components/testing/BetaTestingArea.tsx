import { useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../shared/Button";
import { DebugConsole } from "./DebugConsole";
import { useLogs } from "../../context/LogContext";

export function BetaTestingArea() {
  const { addLog } = useLogs();
  const [devices, setDevices] = useState<string[]>([]);
  //x, setx setter to change value
  //starting off with empty array, the add value with setter
  //string[], because vec<string> in rust backend, turns into an expandable string
  //setter needs to be used to re-render

  // TODO(hiro): implement generic scan logic.
  // - addLog("Scanning for devices...")
  // - await invoke<string[]>("scan_devices")  // TODO(hiro): confirm command name
  // - setDevices(found) and addLog the count
  // - wrap in try/catch and addLog the failure
  const handleScan = useCallback(async () => {
    // your logic here
    void invoke;
  }, [addLog]);

  const handleScanHID = useCallback(async () => { //hid class=
    addLog("Scanning for devices")
    //invoke returns a promise so need to handle that
    try {
      const ports = await invoke<string[]>("scan_devices_hid");
      setDevices(ports);
      addLog(`Found ${ports.length} device(s)`);
      ports.forEach((p) => addLog(p));
    } catch (e) {
      addLog(`Scan failed: ${e}`);
    }
  }, [addLog])

  const handleScanSerial = useCallback(async () => { //serial class
    addLog("Scanning for devices")
    //invoke returns a promise so need to handle that
    try {
      //HERE CHANGE IT SO THAT IT ONLY WORKS FOR SPECIFIC PORT OTHERWISE REJECT, AND FLAG ERR
      const ports = await invoke<string[]>("scan_devices_serial");
      setDevices(ports);
      addLog(`Found ${ports.length} device(s)`);
      if (ports.length == 0) {
        console.log("device not detected at all")
        addLog("No serial to be detected to begin with")
      } else {
        ports.forEach((p) => addLog(p));
      }
    } catch (e) {
      addLog(`Scan failed: ${e}`);
    }
  }, [addLog])

  return (
    <div className="px-8 py-8 space-y-6">
      <header>
        <h2 className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
          Testing
        </h2>
        <p className="text-xs text-gray-600">
          Scan for devices and inspect the live debug console
        </p>
      </header>

      <section className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600"
        >
          Device Scan
        </header>

        <div className="px-5 py-5 space-y-5">
          <div className="flex gap-2">
            <Button onClick={handleScan}>Scan Devices</Button>
            <Button onClick={handleScanHID}>Scan HID</Button>
            <Button onClick={handleScanSerial}>Scan Serial</Button>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
              Devices ({devices.length})
            </div>
            <div
              className="bg-[#0A0A0A] border border-[#222]
                font-mono text-[11px] leading-relaxed px-4 py-3
                max-h-40 overflow-y-auto"
            >
              {devices.length === 0 ? (
                <div className="text-gray-700">No devices scanned</div>
              ) : (
                devices.map((d) => (
                  <div key={d} className="text-gray-400">
                    {d}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <DebugConsole />
    </div>
  );
}
