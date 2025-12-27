import { ReactNode, useState, useEffect, createContext, useContext } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [backendStatus, setBackendStatus] = useState<"connected" | "disconnected">("connected");
  const [videoRagStatus, setVideoRagStatus] = useState<"ready" | "processing" | "offline">("ready");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setBackendStatus("connected");
      setVideoRagStatus("ready");
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        <TopBar backendStatus={backendStatus} videoRagStatus={videoRagStatus} />
        <Sidebar />
        <main 
          className="pt-16 min-h-screen transition-all duration-300"
          style={{ paddingLeft: collapsed ? "64px" : "256px" }}
        >
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
