import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Video {
  id: string;
  name: string;
  uploadDate: string;
  status: "processing" | "completed";
  thumbnail?: string;
  duration?: number;
  analytics?: VideoAnalytics;
}

// Demo video for first-time users
const demoVideo: Video = {
  id: "demo-video-1",
  name: "Championship Game - Q4 Highlights.mp4",
  uploadDate: new Date().toISOString(),
  status: "completed",
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
        playerName: "Marcus Johnson",
        color: "#FF6B35",
        points: Array.from({ length: 50 }, (_, i) => ({
          x: 20 + Math.sin(i * 0.3) * 30,
          y: 30 + Math.cos(i * 0.2) * 20,
          time: i * 0.5,
        })),
      },
      {
        playerId: "p2",
        playerName: "David Chen",
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

export interface Shot {
  id: string;
  timestamp: number;
  type: "made" | "missed";
  position?: { x: number; y: number };
  player?: string;
}

export interface VideoAnalytics {
  totalShots: number;
  made: number;
  missed: number;
  accuracy: number;
  shots: Shot[];
  playerPaths?: Array<{
    playerId: string;
    playerName: string;
    color: string;
    points: Array<{ x: number; y: number; time: number }>;
  }>;
  stats: {
    overall: Record<string, number | string>;
    firstHalf: Record<string, number | string>;
    secondHalf: Record<string, number | string>;
  };
}

interface VideoStore {
  videos: Video[];
  selectedVideoId: string | null;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  selectVideo: (id: string | null) => void;
  getSelectedVideo: () => Video | undefined;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [demoVideo], // Start with demo video
      selectedVideoId: "demo-video-1",

      addVideo: (video) =>
        set((state) => ({
          videos: [...state.videos, video],
        })),

      updateVideo: (id, updates) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),

      deleteVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
          selectedVideoId:
            state.selectedVideoId === id ? null : state.selectedVideoId,
        })),

      selectVideo: (id) => set({ selectedVideoId: id }),

      getSelectedVideo: () => {
        const state = get();
        return state.videos.find((v) => v.id === state.selectedVideoId);
      },
    }),
    {
      name: "paloa-videos",
    }
  )
);
