import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, File, CheckCircle2, CloudUpload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useVideoStore } from "@/store/videoStore";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "processing" | "completed";

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const addVideo = useVideoStore((s) => s.addVideo);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const simulateUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");
    
    for (let i = 0; i <= 60; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }

    setStatus("processing");
    
    for (let i = 60; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(i);
    }

    const newVideo = {
      id: crypto.randomUUID(),
      name: selectedFile.name,
      uploadDate: new Date().toISOString(),
      status: "completed" as const,
      analytics: {
        totalShots: 24,
        made: 15,
        missed: 9,
        accuracy: 62.5,
        shots: Array.from({ length: 24 }, (_, i) => ({
          id: `shot-${i}`,
          timestamp: i * 12 + Math.random() * 10,
          type: Math.random() > 0.375 ? "made" as const : "missed" as const,
          position: { x: Math.random() * 100, y: Math.random() * 50 + 25 },
        })),
        playerPaths: [
          {
            playerId: "p1",
            playerName: "Player 1",
            color: "#FF6B35",
            points: Array.from({ length: 50 }, (_, i) => ({
              x: 20 + Math.sin(i * 0.3) * 30,
              y: 30 + Math.cos(i * 0.2) * 20,
              time: i * 0.5,
            })),
          },
          {
            playerId: "p2",
            playerName: "Player 2",
            color: "#3B82F6",
            points: Array.from({ length: 50 }, (_, i) => ({
              x: 60 + Math.sin(i * 0.25 + 1) * 25,
              y: 50 + Math.cos(i * 0.3 + 0.5) * 20,
              time: i * 0.5,
            })),
          },
        ],
        stats: {
          overall: {
            "Field Goal %": "62.5%",
            "3-Point %": "40.0%",
            "Free Throw %": "85.0%",
            "Points": 42,
            "Assists": 8,
            "Rebounds": 12,
          },
          firstHalf: {
            "Field Goal %": "58.3%",
            "3-Point %": "33.3%",
            "Points": 18,
          },
          secondHalf: {
            "Field Goal %": "66.7%",
            "3-Point %": "50.0%",
            "Points": 24,
          },
        },
      },
    };

    addVideo(newVideo);
    setStatus("completed");

    toast({
      title: "Upload complete!",
      description: "Your video has been processed successfully.",
    });

    setTimeout(() => {
      navigate("/videos");
    }, 1500);
  };

  const statusText = {
    idle: "Ready to upload",
    uploading: "Uploading...",
    processing: "AI Analysis in progress...",
    completed: "Completed",
  };

  const statusIcon = {
    idle: CloudUpload,
    uploading: UploadIcon,
    processing: Sparkles,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcon[status];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">
          <span className="text-gradient">Upload</span>
          <span className="text-foreground ml-2">Video</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Drop your game footage and let AI analyze every play
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-3xl p-12 text-center transition-all duration-500 overflow-hidden",
          "border-2 border-dashed",
          dragOver
            ? "border-primary bg-primary/5 glow-primary"
            : "border-border/50 hover:border-primary/50",
          status !== "idle" && "pointer-events-none"
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
        </div>

        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={status !== "idle"}
        />

        <div className="relative flex flex-col items-center gap-6">
          {/* Icon */}
          <div className={cn(
            "relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500",
            status === "completed" 
              ? "bg-success/20 text-success" 
              : status !== "idle"
              ? "bg-primary/20 text-primary animate-pulse"
              : selectedFile 
              ? "bg-primary/20 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <StatusIcon className={cn(
              "w-12 h-12 transition-transform duration-300",
              status === "processing" && "animate-spin-slow"
            )} />
            {(dragOver || status === "uploading" || status === "processing") && (
              <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl animate-pulse" />
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-xl font-semibold text-foreground mb-2">
              {selectedFile ? selectedFile.name : "Drop video here"}
            </p>
            <p className="text-muted-foreground">
              {selectedFile
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                : "MP4, MOV, or AVI up to 2GB"}
            </p>
          </div>

          {/* File type badges */}
          {!selectedFile && status === "idle" && (
            <div className="flex gap-2 mt-2">
              {["MP4", "MOV", "AVI"].map((type) => (
                <span key={type} className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {status !== "idle" && (
        <div className="mt-8 p-6 rounded-2xl bg-card border border-border/50 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={cn(
                "w-5 h-5",
                status === "completed" ? "text-success" : "text-primary"
              )} />
              <span className="font-semibold text-foreground">{statusText[status]}</span>
            </div>
            <span className="text-2xl font-bold text-gradient font-display">{progress}%</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3" />
            {status === "processing" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer rounded-full" />
            )}
          </div>
          {status === "processing" && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Detecting shots, tracking players, and generating insights...
            </p>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={simulateUpload}
          disabled={!selectedFile || status !== "idle"}
          className="min-w-[240px] h-14 text-lg btn-glow"
        >
          <UploadIcon className="w-5 h-5" />
          {status === "idle" ? "Upload & Analyze" : statusText[status]}
        </Button>
      </div>
    </div>
  );
}
