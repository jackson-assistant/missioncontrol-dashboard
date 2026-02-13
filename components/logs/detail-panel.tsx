import { actionLabels, levelColors, type LogEntry } from "@/lib/logs-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeBadge } from "@/components/shared/code-badge";
import { X, Cpu, Clock, Zap, Hash } from "lucide-react";

function DetailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function DetailPanel({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  const metaItems = [
    log.model && { icon: Cpu, label: "Model", value: <CodeBadge>{log.model}</CodeBadge> },
    log.tokens !== undefined && log.tokens > 0 && {
      icon: Hash,
      label: "Tokens",
      value: <span className="font-mono font-medium text-subtle">{log.tokens.toLocaleString()}</span>,
    },
    log.latency !== undefined && {
      icon: Clock,
      label: "Latency",
      value: <span className="font-mono font-medium text-subtle">{log.latency}ms</span>,
    },
    log.channel && {
      icon: Zap,
      label: "Channel",
      value: <span className="font-medium text-subtle">{log.channel}</span>,
    },
  ].filter(Boolean) as { icon: typeof Cpu; label: string; value: React.ReactNode }[];

  return (
    <div className="flex w-[380px] shrink-0 flex-col border-l border-dashed bg-stone-50/50 dark:bg-zinc-800/60">
      <div className="flex items-center justify-between border-b border-dashed px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Log Detail
        </h3>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{log.agentName}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{log.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${levelColors[log.level] || levelColors.info}`}>
              {log.level}
            </Badge>
            <span className="text-xs font-medium text-subtle">
              {actionLabels[log.action] || log.action}
            </span>
          </div>

          <DetailSection label="Summary">
            <p className="text-sm text-subtle">{log.summary}</p>
          </DetailSection>

          <DetailSection label="Detail">
            <p className="text-xs leading-relaxed text-dim break-all">{log.detail}</p>
          </DetailSection>

          {metaItems.length > 0 && (
            <DetailSection label="Metadata">
              <div className="space-y-1.5">
                {metaItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-dim">{item.label}:</span>
                      {item.value}
                    </div>
                  );
                })}
              </div>
            </DetailSection>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
