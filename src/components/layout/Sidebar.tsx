import { memo, useCallback, useState } from "react";
import {
  Monitor,
  LayoutGrid,
  Layers,

  User,
  Cpu,
  TerminalSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";
import { useDevice } from "../../context/DeviceContext";
import { STORAGE_KEYS } from "../../constants";
import type { PageId } from "../../constants";
import { loadFromStorage, usePersist } from "../../context/persist";

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "display", label: "Display", icon: Monitor },
  { id: "skins", label: "Skins", icon: LayoutGrid },
  { id: "stats", label: "Stats", icon: Layers },

  { id: "profiles", label: "Profile", icon: User },
  { id: "device", label: "Device", icon: Cpu },
  { id: "testing", label: "Testing", icon: TerminalSquare },
];

export const Sidebar = memo(function Sidebar() {
  const { activePage, setActivePage } = useNavigation();
  const { connected, mock } = useDevice();
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.sidebar, false),
  );

  usePersist(STORAGE_KEYS.sidebar, collapsed);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <aside
      className={`flex flex-col border-r border-[#222] bg-[#0A0A0A]
        transition-[width] duration-150 ease-out
        ${collapsed ? "w-[60px]" : "w-[220px]"}`}
    >
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`relative w-full flex items-center gap-3 px-5 py-3
                text-[11px] uppercase tracking-widest
                transition-colors duration-150
                ${isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"}`}
            >
              {isActive ? (
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-rose-600"
                />
              ) : null}
              <Icon strokeWidth={1.5} size={16} className="shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[#222] px-5 py-4">
        {!collapsed ? (
          <div
            className="text-[10px] uppercase tracking-widest text-gray-600 mb-2"
          >
            Status
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 ${
              connected ? "bg-rose-600" : mock ? "bg-gray-400" : "bg-gray-700"
            }`}
          />
          {!collapsed ? (
            <span className="text-[11px] uppercase tracking-widest text-gray-500">
              {connected ? "Connected" : mock ? "Mock" : "Offline"}
            </span>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="border-t border-[#222] py-3 flex items-center justify-center
          text-gray-500 hover:text-white transition-colors duration-150"
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? (
          <ChevronRight strokeWidth={1.5} size={14} />
        ) : (
          <ChevronLeft strokeWidth={1.5} size={14} />
        )}
      </button>
    </aside>
  );
});
