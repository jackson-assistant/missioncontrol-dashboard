import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  badge?: number;
  className?: string;
}

export function SectionHeader({ title, badge, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-dashed px-4 py-3",
        className
      )}
    >
      <span className="text-xs text-amber-500">✦</span>
      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
        {title}
      </h2>
      {badge !== undefined && (
        <Badge
          variant="secondary"
          className="ml-auto flex h-5 w-5 items-center justify-center bg-secondary p-0 text-[10px] text-dim"
        >
          {badge}
        </Badge>
      )}
    </div>
  );
}
