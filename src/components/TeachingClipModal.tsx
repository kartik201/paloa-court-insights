import { useState, useEffect } from "react";
import { X, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TeachingClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  timestamp: string;
  insight: string;
}

export function TeachingClipModal({
  isOpen,
  onClose,
  title,
  timestamp,
  insight,
}: TeachingClipModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying && progress < 100) {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 1, 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, progress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-card rounded-2xl border border-border shadow-2xl animate-scale-in overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Video Player */}
        <div className="aspect-video bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-primary ml-1" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Highlight Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-primary rounded-full animate-pulse-glow" />
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">@ {timestamp}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>0:30</span>
            </div>
          </div>

          {/* Insight */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-foreground">{insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
