import { Badge } from "@/components/ui/badge";
import { roleStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AgentRole } from "@/lib/data";

interface RoleBadgeProps {
  role: AgentRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border px-1.5 py-0 text-[10px]", roleStyles[role], className)}
    >
      {role}
    </Badge>
  );
}
