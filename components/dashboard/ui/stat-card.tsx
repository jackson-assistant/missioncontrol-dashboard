import { cn } from "@/lib/utils";
import { Panel } from "./panel";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-stone-500",
  className,
}: StatCardProps) {
  return (
    <Panel className={cn(className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg bg-muted",
          color
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">
        {value}
      </p>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </Panel>
  );
}
