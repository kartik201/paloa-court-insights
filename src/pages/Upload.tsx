import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, File, CheckCircle2 } from "lucide-react";
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
    
    // Simulate upload progress
    for (let i = 0; i <= 60; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }

    setStatus("processing");
    
    // Simulate processing
    for (let i = 60; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 150));
      setProgress(i);
    }

    // Create video entry with mock analytics
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

    // Auto-redirect after short delay
    setTimeout(() => {
      navigate("/videos");
    }, 1500);
  };

  const statusText = {
    idle: "Ready to upload",
    uploading: "Uploading...",
    processing: "Processing video...",
    completed: "Completed",
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Video</h1>
        <p className="text-muted-foreground">
          Drag and drop your game footage or select a file
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          dragOver
            ? "border-primary bg-primary/5 glow-primary"
            : "border-border hover:border-muted-foreground",
          status !== "idle" && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={status !== "idle"}
        />

        <div className="flex flex-col items-center gap-4">
          {status === "completed" ? (
            <CheckCircle2 className="w-16 h-16 text-success" />
          ) : selectedFile ? (
            <File className="w-16 h-16 text-primary" />
          ) : (
            <UploadIcon className="w-16 h-16 text-muted-foreground" />
          )}

          <div>
            <p className="text-lg font-medium text-foreground">
              {selectedFile ? selectedFile.name : "Drop video here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedFile
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                : "MP4, MOV, or AVI up to 2GB"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {status !== "idle" && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{statusText[status]}</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={simulateUpload}
          disabled={!selectedFile || status !== "idle"}
          className="min-w-[200px]"
        >
          <UploadIcon className="w-5 h-5" />
          {status === "idle" ? "Upload & Process" : statusText[status]}
        </Button>
      </div>
    </div>
  );
}
