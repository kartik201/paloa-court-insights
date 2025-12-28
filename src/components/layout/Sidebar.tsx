import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Upload, Video, BarChart3, MessageSquare, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "./MainLayout";

const navItems = [
  { to: "/upload", icon: Upload, label: "Upload", description: "Add new footage" },
  { to: "/videos", icon: Video, label: "Videos", description: "Your library" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", description: "Performance data" },
  { to: "/ai-coach", icon: MessageSquare, label: "AI Coach", description: "Get insights" },
];

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebarContext();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 border-r border-border/50 transition-all duration-300",
        "bg-gradient-to-b from-sidebar via-sidebar to-background",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <nav className="relative flex flex-col h-full p-4">
        <div className="flex-1 space-y-2 mt-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to || 
              (item.to === "/analytics" && location.pathname.startsWith("/analytics"));
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "nav-link group",
                  isActive && "active",
                  collapsed && "justify-center px-3"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg" 
                    : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-semibold text-sm transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {item.description}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Pro Badge */}
        {!collapsed && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Pro Features</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI-powered video analysis with real-time insights
            </p>
          </div>
        )}

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "self-center w-10 h-10 rounded-xl border border-border/50",
            "bg-card/50 hover:bg-card hover:border-primary/30",
            "transition-all duration-300"
          )}
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
