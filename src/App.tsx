import { memo } from "react";
import { TitleBar } from "./components/layout/TitleBar";
import { Sidebar } from "./components/layout/Sidebar";
import { StatusBar } from "./components/layout/StatusBar";
import { DisplayPreview } from "./components/display/DisplayPreview";
import { DisplayControls } from "./components/display/DisplayControls";
import { LayerStack } from "./components/display/LayerStack";
import { SkinBrowser } from "./components/skins/SkinBrowser";
import { OverlayBrowser } from "./components/overlays/OverlayBrowser";
import { LegendsEditor } from "./components/legends/LegendsEditor";
import { PluginList } from "./components/plugins/PluginList";
import { ProfilesPage } from "./components/profiles/ProfilesPage";
import { DevicePanel } from "./components/device/DevicePanel";
import { BetaTestingArea } from "./components/testing/BetaTestingArea";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { DeviceProvider } from "./context/DeviceContext";
import { DisplayProvider } from "./context/DisplayContext";
import { SkinProvider } from "./context/SkinContext";
import { OverlayProvider } from "./context/OverlayContext";
import { LayerProvider } from "./context/LayerContext";
import { ProfileProvider } from "./context/ProfileContext";
import { LogProvider } from "./context/LogContext";

// Display page is kept mounted but hidden via display:none when navigating
// away, so returning to it is instant with no re-initialization (per Rule 4).
const DisplayPage = memo(function DisplayPage() {
  return (
    <>
      <DisplayPreview />
      <DisplayControls />
      <LayerStack />
    </>
  );
});

function PageRouter() {
  const { activePage } = useNavigation();

  return (
    <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
      <div style={{ display: activePage === "display" ? "block" : "none" }}>
        <DisplayPage />
      </div>
      {activePage === "skins" ? <SkinBrowser /> : null}
      {activePage === "overlays" ? <OverlayBrowser /> : null}
      {activePage === "legends" ? <LegendsEditor /> : null}
      {activePage === "plugins" ? <PluginList /> : null}
      {activePage === "profiles" ? <ProfilesPage /> : null}
      {activePage === "device" ? <DevicePanel /> : null}
      {activePage === "testing" ? <BetaTestingArea /> : null}
    </main>
  );
}

function Shell() {
  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A]">
      <TitleBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <PageRouter />
      </div>
      <StatusBar />
    </div>
  );
}

export function App() {
  return (
    <NavigationProvider>
      <LogProvider>
        <DeviceProvider>
          <DisplayProvider>
            <ProfileProvider>
              <SkinProvider>
                <OverlayProvider>
                  <LayerProvider>
                    <Shell />
                  </LayerProvider>
                </OverlayProvider>
              </SkinProvider>
            </ProfileProvider>
          </DisplayProvider>
        </DeviceProvider>
      </LogProvider>
    </NavigationProvider>
  );
}
