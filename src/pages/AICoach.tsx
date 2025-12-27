import { useState, useRef, useEffect } from "react";
import { Send, Video, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { useVideoStore } from "@/store/videoStore";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp?: string;
  clips?: Array<{ time: string; description: string }>;
}

const suggestedPrompts = [
  "Show me all made shots",
  "Analyze my misses",
  "How can I improve my shooting form?",
  "What patterns do you see in my movement?",
  "Compare first half to second half",
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videos = useVideoStore((s) => s.videos);
  const selectedVideoId = useVideoStore((s) => s.selectedVideoId);
  const selectedVideo = videos.find((v) => v.id === selectedVideoId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 1500));

    const responses: Record<string, Message> = {
      "Show me all made shots": {
        id: crypto.randomUUID(),
        role: "ai",
        content:
          "I found 15 made shots in this video. Here are the key moments where you successfully scored:",
        clips: [
          { time: "1:24", description: "Clean three-pointer from the corner" },
          { time: "3:45", description: "Layup after a great drive" },
          { time: "5:12", description: "Mid-range jumper" },
          { time: "7:33", description: "And-one finish at the rim" },
        ],
      },
      "Analyze my misses": {
        id: crypto.randomUUID(),
        role: "ai",
        content:
          "Looking at your 9 missed shots, I notice a pattern. Most misses (6 out of 9) came from the left side of the court. Your release point seems slightly lower on these attempts.",
        clips: [
          { time: "2:15", description: "Short on left corner three" },
          { time: "4:02", description: "Rushed shot off the dribble" },
          { time: "6:48", description: "Contested mid-range attempt" },
        ],
      },
      "How can I improve my shooting form?": {
        id: crypto.randomUUID(),
        role: "ai",
        content:
          "Based on your video analysis, here are my recommendations:\n\n1. **Follow Through** - Your release is good, but hold your follow-through longer\n2. **Balance** - On left-side shots, ensure your feet are set before shooting\n3. **Arc** - Your three-pointers have a flatter trajectory - aim for higher arc\n4. **Elbow Alignment** - Keep your shooting elbow more tucked on jump shots",
      },
    };

    const response = responses[userMessage] || {
      id: crypto.randomUUID(),
      role: "ai" as const,
      content: `I've analyzed your question about "${userMessage}". Based on the video data, I can see interesting patterns in your gameplay. Your overall shooting accuracy is 62.5%, with stronger performance in the second half. Would you like me to dive deeper into any specific aspect?`,
    };

    setMessages((prev) => [...prev, response]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await simulateAIResponse(input);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="w-8 h-8" />}
        title="No videos to analyze"
        description="Upload a video first to start chatting with your AI Coach."
        action={
          <Button onClick={() => window.location.href = "/upload"}>
            Upload Video
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fade-in">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI Coach Ready
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ask me anything about your game footage. I can analyze shots,
                track movements, and provide personalized coaching tips.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn("chat-bubble", message.role)}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {message.clips && (
                  <div className="mt-4 space-y-2">
                    {message.clips.map((clip, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-3 w-full p-2 rounded-lg bg-background/50 hover:bg-background transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {clip.time}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {clip.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble ai">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:bg-card hover:text-foreground hover:border-primary/30 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your AI Coach..."
              className="flex-1 bg-background border-border"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="w-80 space-y-4">
        {/* Selected Videos */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Video Context
          </h3>
          <div className="space-y-2">
            {selectedVideo ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Video className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {selectedVideo.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a video from your library
              </p>
            )}
          </div>
        </div>

        {/* VideoRAG Status */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            VideoRAG Status
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Ready for queries
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Suggested Questions
          </h3>
          <div className="space-y-2">
            {suggestedPrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left p-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
