import { memo, useCallback, useEffect, useState } from "react";
import { Slider } from "../shared/Slider";
import { Button } from "../shared/Button";
import { useDisplay } from "../../context/DisplayContext";
import { useLogs } from "../../context/LogContext";

export const DisplayControls = memo(function DisplayControls() {
  const {
    brightness,
    speed,
    displayOn,
    hueShift,
    rotation,
    setBrightness,
    setSpeed,
    setDisplayOn,
    setHueShift,
    setRotation,
  } = useDisplay();
  const { addLog } = useLogs();

  // Local state during drag — per Rule 2, never write to context per-frame.
  const [localBrightness, setLocalBrightness] = useState(brightness);
  const [localSpeed, setLocalSpeed] = useState(speed);

  // Sync local when committed value changes externally (e.g. profile switch).
  useEffect(() => setLocalBrightness(brightness), [brightness]);
  useEffect(() => setLocalSpeed(speed), [speed]);

  const handleBrightnessCommit = useCallback(
    (value: number) => {
      setBrightness(value);
      addLog(`Brightness set to ${value}%`);
      // TODO(hiro): connect to Tauri backend — { cmd: "set_param", key: "brightness", value }
    },
    [setBrightness, addLog],
  );

  const handleSpeedCommit = useCallback(
    (value: number) => {
      setSpeed(value);
      addLog(`Speed set to ${value}%`);
      // TODO(hiro): connect to Tauri backend — { cmd: "set_param", key: "speed", value }
    },
    [setSpeed, addLog],
  );

  const handleToggleDisplay = useCallback(() => {
    setDisplayOn(!displayOn);
    addLog(`Display ${!displayOn ? "on" : "off"}`);
    // TODO(hiro): connect to Tauri backend — { cmd: "set_display", on: !displayOn }
  }, [displayOn, setDisplayOn, addLog]);

  const handleToggleHue = useCallback(() => {
    setHueShift(!hueShift);
    addLog(`Hue shift ${!hueShift ? "enabled" : "disabled"}`);
    // TODO(hiro): connect to Tauri backend — { cmd: "set_param", key: "hue_shift", value: !hueShift }
  }, [hueShift, setHueShift, addLog]);

  const handleRotate = useCallback(() => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    addLog(`Rotation set to ${next}°`);
    // TODO(hiro): connect to Tauri backend — { cmd: "set_param", key: "rotation", value: next }
  }, [rotation, setRotation, addLog]);

  return (
    <section className="px-8 pb-6">
      <div className="border border-[#222] bg-[#111]">
        <header
          className="px-5 py-3 border-b border-[#222]
            text-[10px] uppercase tracking-widest text-gray-600"
        >
          Controls
        </header>
        <div className="px-5 py-5 space-y-4">
          <Slider
            label="Brightness"
            value={localBrightness}
            onChange={setLocalBrightness}
            onChangeEnd={handleBrightnessCommit}
          />
          <Slider
            label="Speed"
            value={localSpeed}
            onChange={setLocalSpeed}
            onChangeEnd={handleSpeedCommit}
          />
          <div className="flex flex-wrap gap-2 pt-2">
            <Button active={displayOn} onClick={handleToggleDisplay}>
              {displayOn ? "Display On" : "Display Off"}
            </Button>
            <Button active={hueShift} onClick={handleToggleHue}>
              Hue Shift
            </Button>
            <Button onClick={handleRotate}>Rotate {rotation}°</Button>
          </div>
        </div>
      </div>
    </section>
  );
});
