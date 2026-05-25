import { SkinConnector } from "./SkinConnector";
import { DebugConsole } from "./DebugConsole";
import { ParamTester } from "./ParamTester";

export function BetaTestingArea() {
  return (
    <div className="px-8 py-8 space-y-6">
      <header>
        <h2
          className="text-[11px] uppercase tracking-widest text-gray-400 mb-1"
        >
          Testing
        </h2>
        <p className="text-xs text-gray-600">
          Developer tools for connecting Godot skin prototypes
        </p>
      </header>
      <SkinConnector />
      <DebugConsole />
      <ParamTester />
    </div>
  );
}
