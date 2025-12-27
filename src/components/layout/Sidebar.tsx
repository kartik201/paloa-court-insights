import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Upload, Video, BarChart3, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "./MainLayout";

const navItems = [
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/videos", icon: Video, label: "Videos" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/ai-coach", icon: MessageSquare, label: "AI Coach" },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebarContext();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex flex-col h-full p-3">
        <div className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || 
              (item.to === "/analytics" && location.pathname.startsWith("/analytics"));
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "nav-link",
                  isActive && "active",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="self-center mt-4"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </nav>
    </aside>
  );
}
