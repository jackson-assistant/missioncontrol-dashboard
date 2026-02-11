import { cn } from "@/lib/utils";
import { statusDotColors, statusTextColors } from "@/lib/styles";
import type { AgentStatus } from "@/lib/data";

const sizeMap = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
};

interface StatusDotProps {
  status: AgentStatus;
  size?: keyof typeof sizeMap;
  label?: boolean;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  status,
  size = "sm",
  label = false,
  pulse = false,
  className,
}: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "shrink-0 rounded-full",
          sizeMap[size],
          statusDotColors[status],
          pulse && "animate-pulse"
        )}
      />
      {label && (
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-wider",
            statusTextColors[status]
          )}
        >
          {status}
        </span>
      )}
    </span>
  );
}
