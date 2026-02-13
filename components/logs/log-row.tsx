import { actionLabels, levelColors, type LogEntry } from "@/lib/logs-data";
import { Badge } from "@/components/ui/badge";
import { CodeBadge } from "@/components/shared/code-badge";
import { ChevronRight } from "lucide-react";

export function LogRow({
  log,
  isSelected,
  onClick,
}: {
  log: LogEntry;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-start gap-3 border-b border-dashed px-4 py-2.5 text-left transition-colors ${
        isSelected
          ? "border-stone-300 bg-stone-100 dark:border-zinc-600 dark:bg-zinc-800"
          : "border-stone-100 hover:bg-stone-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
      }`}
    >
      <span className="w-[72px] shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
        {log.timestamp}
      </span>

      <span className="w-[90px] shrink-0 truncate text-[11px] font-medium text-subtle">
        {log.agentName}
      </span>

      <Badge
        className={`w-[54px] shrink-0 justify-center rounded px-1.5 py-0 text-[9px] font-bold uppercase ${levelColors[log.level] || levelColors.info}`}
      >
        {log.level}
      </Badge>

      <span className="w-[100px] shrink-0 truncate text-[11px] font-medium text-subtle">
        {actionLabels[log.action] || log.action}
      </span>

      <span className="min-w-0 flex-1 truncate text-[11px] text-dim">
        {log.summary}
      </span>

      <div className="flex shrink-0 items-center gap-2">
        {log.model && <CodeBadge className="text-[9px]">{log.model}</CodeBadge>}
        {log.tokens !== undefined && log.tokens > 0 && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {log.tokens.toLocaleString()}t
          </span>
        )}
        {log.latency !== undefined && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {log.latency}ms
          </span>
        )}
      </div>

      <ChevronRight
        className={`h-3.5 w-3.5 shrink-0 transition-colors ${
          isSelected
            ? "text-dim"
            : "text-stone-300 group-hover:text-stone-400 dark:text-zinc-700 dark:group-hover:text-zinc-500"
        }`}
      />
    </button>
  );
}
