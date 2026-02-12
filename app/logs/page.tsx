"use client";

import { useState, useMemo } from "react";
import { useLogs } from "@/lib/hooks";
import { mapGatewayLog, type LogEntry } from "@/lib/logs-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LogRow } from "@/components/logs/log-row";
import { DetailPanel } from "@/components/logs/detail-panel";
import { StatsBar } from "@/components/logs/stats-bar";
import { Terminal } from "lucide-react";

export default function LogsPage() {
  const { logs: rawLogs, isLoading } = useLogs();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const logEntries = useMemo(
    () => rawLogs.map((raw: any, i: number) => mapGatewayLog(raw, i)),
    [rawLogs]
  );

  const filteredLogs = useMemo(() => {
    return logEntries.filter((log: LogEntry) => {
      if (levelFilter && log.level !== levelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !log.summary.toLowerCase().includes(q) &&
          !log.agentName.toLowerCase().includes(q) &&
          !log.detail.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [logEntries, levelFilter, search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-dashed px-6 py-3">
        <PageHeader
          icon={Terminal}
          title="Logs"
          description="Real-time gateway log stream"
        />
      </div>

      <StatsBar logs={filteredLogs} />

      {/* Simple filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dashed px-4 py-2.5">
        <select
          value={levelFilter ?? ""}
          onChange={(e) => setLevelFilter(e.target.value || null)}
          className="rounded-md border bg-card px-2 py-1 text-[11px] font-medium text-subtle outline-none"
        >
          <option value="">All Levels</option>
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
        </select>

        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border bg-card px-2.5 py-1 text-[11px] text-subtle placeholder:text-muted-foreground outline-none"
        />

        <span className="ml-auto text-[10px] font-medium text-muted-foreground">
          {filteredLogs.length} entries
        </span>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          <div>
            {isLoading && filteredLogs.length === 0 ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log: LogEntry) => (
                <LogRow
                  key={log.id}
                  log={log}
                  isSelected={selectedLog?.id === log.id}
                  onClick={() =>
                    setSelectedLog(selectedLog?.id === log.id ? null : log)
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={Terminal}
                message="No logs match your filters"
                hint="Try adjusting or clearing filters"
              />
            )}
          </div>
        </ScrollArea>

        {selectedLog && (
          <DetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
        )}
      </div>
    </div>
  );
}
