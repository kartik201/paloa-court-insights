import { cn } from "@/lib/utils";
import { Activity, Zap } from "lucide-react";

interface TopBarProps {
  backendStatus: "connected" | "disconnected";
  videoRagStatus: "ready" | "processing" | "offline";
}

export function TopBar({ backendStatus, videoRagStatus }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 glass border-b border-border/50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center glow-primary">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider">
              <span className="text-gradient">PALOA</span>
              <span className="text-foreground/80 ml-1">FILM</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/50">
            <span className={cn("w-2 h-2 rounded-full", backendStatus === "connected" ? "bg-success animate-pulse" : "bg-destructive")} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {backendStatus === "connected" ? "Live" : "Offline"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/50">
            <Zap className={cn("w-3.5 h-3.5", videoRagStatus === "ready" ? "text-accent" : "text-muted-foreground")} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">VideoRAG</span>
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", videoRagStatus === "ready" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground")}>
              {videoRagStatus}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
