"use client";

import { useState, useMemo } from "react";
import {
  logEntries,
  actionLabels,
  levelColors,
  getUniqueAgents,
  getUniqueActions,
  getUniqueLevels,
  type LogEntry,
  type LogLevel,
  type LogAction,
} from "@/lib/logs-data";
import { agents } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { CodeBadge } from "@/components/dashboard/ui/code-badge";
import { EmptyState } from "@/components/dashboard/ui/empty-state";
import {
  Terminal,
  Filter,
  X,
  ChevronRight,
  Cpu,
  Clock,
  Zap,
  Hash,
} from "lucide-react";

// ── Shared select style ────────────────────────────────────────────────────

const selectClass =
  "rounded-md border bg-card px-2 py-1 text-[11px] font-medium text-subtle outline-none";

// ── Filter Bar ─────────────────────────────────────────────────────────────

interface Filters {
  agentId: string | null;
  level: LogLevel | null;
  action: LogAction | null;
  search: string;
}

function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
}) {
  const uniqueAgents = getUniqueAgents();
  const uniqueLevels = getUniqueLevels();
  const uniqueActions = getUniqueActions();

  const hasFilters =
    filters.agentId || filters.level || filters.action || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-dashed px-4 py-2.5">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />

      <select
        value={filters.agentId ?? ""}
        onChange={(e) => onChange({ ...filters, agentId: e.target.value || null })}
        className={selectClass}
      >
        <option value="">All Agents</option>
        {uniqueAgents.map((id) => {
          const agent = agents.find((a) => a.id === id);
          return (
            <option key={id} value={id}>
              {agent?.name ?? id}
            </option>
          );
        })}
      </select>

      <select
        value={filters.level ?? ""}
        onChange={(e) => onChange({ ...filters, level: (e.target.value as LogLevel) || null })}
        className={selectClass}
      >
        <option value="">All Levels</option>
        {uniqueLevels.map((level) => (
          <option key={level} value={level}>{level.toUpperCase()}</option>
        ))}
      </select>

      <select
        value={filters.action ?? ""}
        onChange={(e) => onChange({ ...filters, action: (e.target.value as LogAction) || null })}
        className={selectClass}
      >
        <option value="">All Actions</option>
        {uniqueActions.map((action) => (
          <option key={action} value={action}>{actionLabels[action]}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search logs..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="rounded-md border bg-card px-2.5 py-1 text-[11px] text-subtle placeholder:text-muted-foreground outline-none"
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onChange({ agentId: null, level: null, action: null, search: "" })}
          className="text-muted-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}

      <span className="ml-auto text-[10px] font-medium text-muted-foreground">
        {resultCount} entries
      </span>
    </div>
  );
}

// ── Log Row ────────────────────────────────────────────────────────────────

function LogRow({
  log,
  isSelected,
  onClick,
}: {
  log: LogEntry;
  isSelected: boolean;
  onClick: () => void;
}) {
  const agent = agents.find((a) => a.id === log.agentId);

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

      <div className="flex w-[90px] shrink-0 items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ backgroundColor: agent?.color ?? "#888" }}
        >
          {agent?.avatar ?? "??"}
        </span>
        <span className="truncate text-[11px] font-medium text-subtle">
          {log.agentName}
        </span>
      </div>

      <Badge
        className={`w-[54px] shrink-0 justify-center rounded px-1.5 py-0 text-[9px] font-bold uppercase ${levelColors[log.level]}`}
      >
        {log.level}
      </Badge>

      <span className="w-[100px] shrink-0 truncate text-[11px] font-medium text-subtle">
        {actionLabels[log.action]}
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

// ── Detail Panel ───────────────────────────────────────────────────────────

function DetailPanel({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  const agent = agents.find((a) => a.id === log.agentId);

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
      {/* Header */}
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
          {/* Agent + Time */}
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: agent?.color ?? "#888" }}
            >
              {agent?.avatar ?? "??"}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {log.agentName}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {log.timestamp}
              </p>
            </div>
          </div>

          {/* Level + Action */}
          <div className="flex items-center gap-2">
            <Badge className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${levelColors[log.level]}`}>
              {log.level}
            </Badge>
            <span className="text-xs font-medium text-subtle">
              {actionLabels[log.action]}
            </span>
          </div>

          {/* Summary */}
          <DetailSection label="Summary">
            <p className="text-sm text-subtle">{log.summary}</p>
          </DetailSection>

          {/* Detail */}
          <DetailSection label="Detail">
            <p className="text-xs leading-relaxed text-dim">{log.detail}</p>
          </DetailSection>

          {/* Metadata */}
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

// ── Stats Bar ──────────────────────────────────────────────────────────────

function StatsBar({ logs }: { logs: LogEntry[] }) {
  const errorCount = logs.filter((l) => l.level === "error").length;
  const warnCount = logs.filter((l) => l.level === "warn").length;
  const apiCalls = logs.filter((l) => l.action === "api_call").length;
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokens ?? 0), 0);

  return (
    <div className="flex items-center gap-6 border-b border-dashed px-4 py-2">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Live
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-dim">
          <span className="font-bold text-stone-700 dark:text-zinc-200">{logs.length}</span> entries
        </span>
        <span className="text-dim">
          <span className="font-bold text-violet-600 dark:text-violet-400">{apiCalls}</span> API calls
        </span>
        <span className="text-dim">
          <span className="font-bold text-stone-700 dark:text-zinc-200">
            {totalTokens >= 1_000_000
              ? `${(totalTokens / 1_000_000).toFixed(1)}M`
              : `${(totalTokens / 1_000).toFixed(1)}K`}
          </span>{" "}
          tokens
        </span>
        {errorCount > 0 && (
          <span className="text-rose-500">
            <span className="font-bold">{errorCount}</span> errors
          </span>
        )}
        {warnCount > 0 && (
          <span className="text-amber-500">
            <span className="font-bold">{warnCount}</span> warnings
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function LogsPage() {
  const [filters, setFilters] = useState<Filters>({
    agentId: null,
    level: null,
    action: null,
    search: "",
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    return logEntries.filter((log) => {
      if (filters.agentId && log.agentId !== filters.agentId) return false;
      if (filters.level && log.level !== filters.level) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !log.summary.toLowerCase().includes(q) &&
          !log.agentName.toLowerCase().includes(q) &&
          !log.detail.toLowerCase().includes(q) &&
          !(log.model ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-dashed px-6 py-3">
        <PageHeader
          icon={Terminal}
          title="Logs"
          description="Real-time activity stream across all Clawd agents"
        />
      </div>

      <StatsBar logs={filteredLogs} />
      <FilterBar filters={filters} onChange={setFilters} resultCount={filteredLogs.length} />

      <div className="flex flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          <div>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
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
