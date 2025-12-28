import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("relative rounded-xl bg-muted/50 overflow-hidden", className)}><div className="absolute inset-0 -translate-x-full bg-shimmer animate-shimmer" /></div>;
}

export function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2"><Skeleton className="h-9 flex-1" /><Skeleton className="h-9 flex-1" /></div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between"><Skeleton className="h-10 w-80" /><Skeleton className="h-12 w-40" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="kpi-card"><Skeleton className="h-4 w-24 mb-4" /><Skeleton className="h-12 w-20" /></div>)}
      </div>
    </div>
  );
}
