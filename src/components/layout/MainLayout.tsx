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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-primary w-[600px] h-[600px] -top-48 -right-48 opacity-30" />
          <div className="orb orb-secondary w-[400px] h-[400px] bottom-0 left-1/4 opacity-20" style={{ animationDelay: "2s" }} />
          <div className="orb orb-primary w-[300px] h-[300px] top-1/2 right-1/4 opacity-10" style={{ animationDelay: "4s" }} />
        </div>
        
        <TopBar backendStatus={backendStatus} videoRagStatus={videoRagStatus} />
        <Sidebar />
        <main 
          className="relative pt-16 min-h-screen transition-all duration-300"
          style={{ paddingLeft: collapsed ? "80px" : "288px" }}
        >
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
