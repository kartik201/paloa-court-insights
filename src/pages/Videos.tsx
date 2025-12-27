import { useNavigate } from "react-router-dom";
import { Video, Trash2, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { VideoCardSkeleton } from "@/components/common/Skeleton";
import { useVideoStore, Video as VideoType } from "@/store/videoStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function VideoCard({ video }: { video: VideoType }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const deleteVideo = useVideoStore((s) => s.deleteVideo);
  const selectVideo = useVideoStore((s) => s.selectVideo);

  const handleAnalytics = () => {
    selectVideo(video.id);
    navigate(`/analytics/${video.id}`);
  };

  const handleAICoach = () => {
    selectVideo(video.id);
    navigate("/ai-coach");
  };

  const handleDelete = () => {
    deleteVideo(video.id);
    toast({
      title: "Video deleted",
      description: `"${video.name}" has been removed.`,
    });
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:glow-primary">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Video className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground truncate">{video.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(video.uploadDate).toLocaleDateString()}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "status-badge w-fit",
            video.status === "completed" ? "completed" : "processing"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              video.status === "completed" ? "bg-success" : "bg-muted-foreground animate-pulse"
            )}
          />
          {video.status === "completed" ? "Completed" : "Processing"}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAnalytics}
            disabled={video.status !== "completed"}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAICoach}
            disabled={video.status !== "completed"}
          >
            <MessageSquare className="w-4 h-4" />
            AI Coach
          </Button>
          <Button
            variant="icon"
            size="icon"
            onClick={handleDelete}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const videos = useVideoStore((s) => s.videos);
  const navigate = useNavigate();

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={<Video className="w-8 h-8" />}
        title="No videos yet"
        description="Upload a video to get started with analytics and AI coaching."
        action={
          <Button onClick={() => navigate("/upload")}>
            Upload Your First Video
          </Button>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Videos</h1>
          <p className="text-muted-foreground mt-1">
            {videos.length} video{videos.length !== 1 && "s"} in your library
          </p>
        </div>
        <Button onClick={() => navigate("/upload")}>
          Upload New Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
