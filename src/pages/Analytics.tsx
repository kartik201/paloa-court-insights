import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Target, Activity, TrendingUp, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { AnalyticsSkeleton } from "@/components/common/Skeleton";
import { useVideoStore } from "@/store/videoStore";
import { cn } from "@/lib/utils";

function KPICard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={cn("kpi-card", accent && "border-primary/30")}>
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className={cn("text-4xl font-bold", accent ? "text-gradient" : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

function SummaryTab({ analytics }: { analytics: NonNullable<ReturnType<typeof useVideoStore.getState>["videos"][0]["analytics"]> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <KPICard label="Total Shots" value={analytics.totalShots} icon={Target} />
      <KPICard label="Made" value={analytics.made} icon={Activity} />
      <KPICard label="Missed" value={analytics.missed} icon={TrendingUp} />
      <KPICard
        label="Accuracy"
        value={`${analytics.accuracy}%`}
        icon={Target}
        accent
      />
    </div>
  );
}

function ShotsTab({ shots }: { shots: NonNullable<ReturnType<typeof useVideoStore.getState>["videos"][0]["analytics"]>["shots"] }) {
  const [hoveredShot, setHoveredShot] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground">Shot Timeline</h3>
      
      {/* Timeline */}
      <div className="relative py-8">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
        
        <div className="relative flex justify-between px-4">
          {shots.map((shot) => (
            <div
              key={shot.id}
              className="relative group"
              onMouseEnter={() => setHoveredShot(shot.id)}
              onMouseLeave={() => setHoveredShot(null)}
            >
              <button
                className={cn(
                  "timeline-marker cursor-pointer",
                  shot.type === "made" ? "made" : "missed"
                )}
              />
              
              {/* Tooltip */}
              {hoveredShot === shot.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-card border border-border rounded-lg shadow-xl z-10 whitespace-nowrap animate-scale-in">
                  <p className="text-sm font-medium text-foreground">
                    {shot.type === "made" ? "Made Shot" : "Missed Shot"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(shot.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Made</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Missed</span>
        </div>
      </div>

      {/* Shot List */}
      <div className="mt-8 space-y-2">
        {shots.slice(0, 10).map((shot) => (
          <div
            key={shot.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                shot.type === "made" ? "bg-success" : "bg-destructive"
              )}
            />
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{formatTime(shot.timestamp)}</span>
            <span
              className={cn(
                "text-sm font-medium ml-auto",
                shot.type === "made" ? "text-success" : "text-destructive"
              )}
            >
              {shot.type === "made" ? "Made" : "Missed"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingTab({ playerPaths }: { playerPaths?: NonNullable<ReturnType<typeof useVideoStore.getState>["videos"][0]["analytics"]>["playerPaths"] }) {
  const [visiblePlayers, setVisiblePlayers] = useState<Set<string>>(
    new Set(playerPaths?.map((p) => p.playerId) || [])
  );

  const togglePlayer = (playerId: string) => {
    const newSet = new Set(visiblePlayers);
    if (newSet.has(playerId)) {
      newSet.delete(playerId);
    } else {
      newSet.add(playerId);
    }
    setVisiblePlayers(newSet);
  };

  if (!playerPaths || playerPaths.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="w-8 h-8" />}
        title="No tracking data"
        description="Player tracking data will appear here once processed."
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Court Visualization */}
      <div className="relative aspect-[2/1] bg-card rounded-xl border border-border overflow-hidden">
        {/* Court Background */}
        <div className="absolute inset-4 border-2 border-muted rounded-lg">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-muted rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-muted" />
          {/* Three Point Lines */}
          <div className="absolute left-4 top-1/4 bottom-1/4 w-24 border-2 border-muted rounded-r-full" />
          <div className="absolute right-4 top-1/4 bottom-1/4 w-24 border-2 border-muted rounded-l-full" />
        </div>

        {/* Player Paths */}
        <svg className="absolute inset-0 w-full h-full">
          {playerPaths.map(
            (player) =>
              visiblePlayers.has(player.playerId) && (
                <path
                  key={player.playerId}
                  d={`M ${player.points.map((p) => `${p.x}% ${p.y}%`).join(" L ")}`}
                  fill="none"
                  stroke={player.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
              )
          )}
        </svg>
      </div>

      {/* Player Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {playerPaths.map((player) => (
          <button
            key={player.playerId}
            onClick={() => togglePlayer(player.playerId)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
              visiblePlayers.has(player.playerId)
                ? "bg-card border-border"
                : "bg-transparent border-transparent opacity-50"
            )}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span className="text-sm font-medium text-foreground">
              {player.playerName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ stats }: { stats: NonNullable<ReturnType<typeof useVideoStore.getState>["videos"][0]["analytics"]>["stats"] }) {
  const sections = [
    { title: "Overall", data: stats.overall },
    { title: "First Half", data: stats.firstHalf },
    { title: "Second Half", data: stats.secondHalf },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-lg font-semibold text-foreground mb-4">{section.title}</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <tbody>
                {Object.entries(section.data).map(([key, value], i) => (
                  <tr
                    key={key}
                    className={cn(
                      "border-b border-border last:border-0",
                      i % 2 === 0 && "bg-muted/30"
                    )}
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">{key}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videos = useVideoStore((s) => s.videos);
  const video = videos.find((v) => v.id === videoId);

  if (!video) {
    return (
      <EmptyState
        icon={<Target className="w-8 h-8" />}
        title="Video not found"
        description="Select a video from your library to view analytics."
        action={
          <Button onClick={() => navigate("/videos")}>Go to Videos</Button>
        }
      />
    );
  }

  if (!video.analytics) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{video.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span
              className={cn(
                "status-badge",
                video.status === "completed" ? "completed" : "processing"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  video.status === "completed" ? "bg-success" : "bg-muted-foreground"
                )}
              />
              {video.status === "completed" ? "Analysis Complete" : "Processing"}
            </span>
          </div>
        </div>
        <Button onClick={() => navigate("/ai-coach")}>
          <MessageSquare className="w-5 h-5" />
          Open AI Coach
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-card border border-border p-1">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="shots">Shots</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <SummaryTab analytics={video.analytics} />
        </TabsContent>

        <TabsContent value="shots">
          <ShotsTab shots={video.analytics.shots} />
        </TabsContent>

        <TabsContent value="tracking">
          <TrackingTab playerPaths={video.analytics.playerPaths} />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab stats={video.analytics.stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
