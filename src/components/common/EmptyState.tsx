import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in",
        className
      )}
    >
      {/* Icon container with glow */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-primary border border-primary/20">
          {icon}
        </div>
        <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
      </div>
      
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 text-lg">{description}</p>
      {action}
    </div>
  );
}
