import { cn } from "@/lib/utils";

interface TopBarProps {
  backendStatus: "connected" | "disconnected";
  videoRagStatus: "ready" | "processing" | "offline";
}

export function TopBar({ backendStatus, videoRagStatus }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide uppercase">
            <span className="text-foreground">Paloa</span>
            <span className="text-muted-foreground ml-2">Film Analytics</span>
          </h1>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          {/* Backend Status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                backendStatus === "connected"
                  ? "bg-success animate-pulse"
                  : "bg-destructive"
              )}
            />
            <span className="text-xs text-muted-foreground">Backend</span>
          </div>

          {/* VideoRAG Status */}
          <div
            className={cn(
              "status-badge",
              videoRagStatus === "ready" && "completed",
              videoRagStatus === "processing" && "processing",
              videoRagStatus === "offline" && "bg-destructive/20 text-destructive"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                videoRagStatus === "ready" && "bg-success",
                videoRagStatus === "processing" && "bg-primary animate-pulse",
                videoRagStatus === "offline" && "bg-destructive"
              )}
            />
            VideoRAG
          </div>
        </div>
      </div>
    </header>
  );
}
