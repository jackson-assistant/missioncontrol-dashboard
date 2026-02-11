import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  hint?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  hint,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="mb-2 h-8 w-8" />}
      <p className="text-sm font-medium">{message}</p>
      {hint && <p className="mt-1 text-xs">{hint}</p>}
    </div>
  );
}
