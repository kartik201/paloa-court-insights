import { useNavigate } from "react-router-dom";
import { Video, Trash2, BarChart3, MessageSquare, Play, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useVideoStore, Video as VideoType } from "@/store/videoStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function VideoCard({ video, index }: { video: VideoType; index: number }) {
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
    <div 
      className="video-card group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted to-background">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
          <svg className="absolute inset-0 w-full h-full">
            <pattern id={`grid-${video.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/30" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#grid-${video.id})`} />
          </svg>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/50 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <Play className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground ml-1 transition-colors" />
            </div>
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-foreground truncate text-lg group-hover:text-gradient transition-all">
            {video.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-sm">
              {new Date(video.uploadDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
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
              "w-2 h-2 rounded-full",
              video.status === "completed" 
                ? "bg-success shadow-[0_0_8px_hsl(145_80%_45%/0.8)]" 
                : "bg-warning animate-pulse shadow-[0_0_8px_hsl(45_100%_55%/0.8)]"
            )}
          />
          {video.status === "completed" ? "Analysis Complete" : "Processing..."}
        </div>

        {/* Analytics Preview */}
        {video.analytics && (
          <div className="grid grid-cols-3 gap-3 py-3 border-t border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient font-display">{video.analytics.totalShots}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Shots</p>
            </div>
            <div className="text-center border-x border-border/50">
              <p className="text-2xl font-bold text-success font-display">{video.analytics.made}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Made</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground font-display">{video.analytics.accuracy}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Accuracy</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 btn-glow"
            onClick={handleAnalytics}
            disabled={video.status !== "completed"}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleAICoach}
            disabled={video.status !== "completed"}
          >
            <MessageSquare className="w-4 h-4" />
            AI Coach
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-transparent"
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
        icon={<Video className="w-10 h-10" />}
        title="No videos yet"
        description="Upload your first game footage to unlock AI-powered analytics and coaching insights."
        action={
          <Button size="lg" onClick={() => navigate("/upload")} className="btn-glow">
            Upload Your First Video
          </Button>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold">
            <span className="text-gradient">Video</span>
            <span className="text-foreground ml-2">Library</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {videos.length} video{videos.length !== 1 && "s"} • AI analysis ready
          </p>
        </div>
        <Button size="lg" onClick={() => navigate("/upload")} className="btn-glow">
          <Video className="w-5 h-5" />
          Upload New
        </Button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
}
