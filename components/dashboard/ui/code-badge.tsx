import { cn } from "@/lib/utils";

interface CodeBadgeProps extends React.ComponentProps<"code"> {
  children: React.ReactNode;
}

export function CodeBadge({ className, children, ...props }: CodeBadgeProps) {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 text-[10px] text-dim",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
