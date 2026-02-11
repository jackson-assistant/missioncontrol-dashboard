import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-dim" />
        </div>
      )}
      <div>
        <h1 className="text-lg font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-dim">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
