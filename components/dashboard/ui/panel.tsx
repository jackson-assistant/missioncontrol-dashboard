import { cn } from "@/lib/utils";

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function Panel({
  className,
  padding = "md",
  children,
}: {
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed bg-card",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
