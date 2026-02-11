"use client";

import { useState, useMemo } from "react";
import {
  logEntries,
  actionLabels,
  levelColors,
  actionColors,
  getUniqueAgents,
  getUniqueActions,
  getUniqueLevels,
  type LogEntry,
  type LogLevel,
  type LogAction,
} from "@/lib/logs-data";
import { agents } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-wrap items-center gap-2 border-b border-dashed border-stone-200 px-4 py-2.5 dark:border-zinc-700">
      <Filter className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />

      {/* Agent filter */}
      <select
        value={filters.agentId ?? ""}
        onChange={(e) =>
          onChange({ ...filters, agentId: e.target.value || null })
        }
        className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-600 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
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

      {/* Level filter */}
      <select
        value={filters.level ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            level: (e.target.value as LogLevel) || null,
          })
        }
        className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-600 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        <option value="">All Levels</option>
        {uniqueLevels.map((level) => (
          <option key={level} value={level}>
            {level.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Action filter */}
      <select
        value={filters.action ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            action: (e.target.value as LogAction) || null,
          })
        }
        className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-600 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        <option value="">All Actions</option>
        {uniqueActions.map((action) => (
          <option key={action} value={action}>
            {actionLabels[action]}
          </option>
        ))}
      </select>

      {/* Search */}
      <input
        type="text"
        placeholder="Search logs..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-700 placeholder:text-stone-400 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500"
      />

      {hasFilters && (
        <button
          onClick={() =>
            onChange({
              agentId: null,
              level: null,
              action: null,
              search: "",
            })
          }
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-stone-400 transition-colors hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}

      <span className="ml-auto text-[10px] font-medium text-stone-400 dark:text-zinc-500">
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
      {/* Timestamp */}
      <span className="w-[72px] shrink-0 font-mono text-[11px] tabular-nums text-stone-400 dark:text-zinc-500">
        {log.timestamp}
      </span>

      {/* Agent pill */}
      <div className="flex w-[90px] shrink-0 items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ backgroundColor: agent?.color ?? "#888" }}
        >
          {agent?.avatar ?? "??"}
        </span>
        <span className="truncate text-[11px] font-medium text-stone-700 dark:text-zinc-300">
          {log.agentName}
        </span>
      </div>

      {/* Level badge */}
      <Badge
        className={`w-[54px] shrink-0 justify-center rounded px-1.5 py-0 text-[9px] font-bold uppercase ${levelColors[log.level]}`}
      >
        {log.level}
      </Badge>

      {/* Action */}
      <span
        className={`w-[100px] shrink-0 truncate text-[11px] font-medium ${actionColors[log.action]}`}
      >
        {actionLabels[log.action]}
      </span>

      {/* Summary */}
      <span className="min-w-0 flex-1 truncate text-[11px] text-stone-600 dark:text-zinc-400">
        {log.summary}
      </span>

      {/* Meta badges */}
      <div className="flex shrink-0 items-center gap-2">
        {log.model && (
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] text-stone-500 dark:bg-zinc-700 dark:text-zinc-400">
            {log.model}
          </code>
        )}
        {log.tokens !== undefined && log.tokens > 0 && (
          <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-500">
            {log.tokens.toLocaleString()}t
          </span>
        )}
        {log.latency !== undefined && (
          <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-500">
            {log.latency}ms
          </span>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight
        className={`h-3.5 w-3.5 shrink-0 transition-colors ${
          isSelected
            ? "text-stone-500 dark:text-zinc-400"
            : "text-stone-300 group-hover:text-stone-400 dark:text-zinc-700 dark:group-hover:text-zinc-500"
        }`}
      />
    </button>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────

function DetailPanel({
  log,
  onClose,
}: {
  log: LogEntry;
  onClose: () => void;
}) {
  const agent = agents.find((a) => a.id === log.agentId);

  return (
    <div className="flex w-[380px] shrink-0 flex-col border-l border-dashed border-stone-300 bg-stone-50/50 dark:border-zinc-700 dark:bg-zinc-800/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashed border-stone-200 px-4 py-3 dark:border-zinc-700">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-zinc-100">
          Log Detail
        </h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-600 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
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
              <p className="text-sm font-semibold text-stone-800 dark:text-zinc-100">
                {log.agentName}
              </p>
              <p className="font-mono text-[11px] text-stone-400 dark:text-zinc-500">
                {log.timestamp}
              </p>
            </div>
          </div>

          {/* Level + Action */}
          <div className="flex items-center gap-2">
            <Badge
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${levelColors[log.level]}`}
            >
              {log.level}
            </Badge>
            <span
              className={`text-xs font-medium ${actionColors[log.action]}`}
            >
              {actionLabels[log.action]}
            </span>
          </div>

          {/* Summary */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Summary
            </p>
            <p className="mt-1 text-sm text-stone-700 dark:text-zinc-300">
              {log.summary}
            </p>
          </div>

          {/* Detail */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
              Detail
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-zinc-400">
              {log.detail}
            </p>
          </div>

          {/* Metadata */}
          {(log.model || log.tokens || log.latency || log.channel) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                Metadata
              </p>
              <div className="mt-2 space-y-1.5">
                {log.model && (
                  <div className="flex items-center gap-2 text-xs">
                    <Cpu className="h-3 w-3 text-stone-400 dark:text-zinc-500" />
                    <span className="text-stone-500 dark:text-zinc-400">
                      Model:
                    </span>
                    <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] dark:bg-zinc-700">
                      {log.model}
                    </code>
                  </div>
                )}
                {log.tokens !== undefined && log.tokens > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <Hash className="h-3 w-3 text-stone-400 dark:text-zinc-500" />
                    <span className="text-stone-500 dark:text-zinc-400">
                      Tokens:
                    </span>
                    <span className="font-mono font-medium text-stone-700 dark:text-zinc-300">
                      {log.tokens.toLocaleString()}
                    </span>
                  </div>
                )}
                {log.latency !== undefined && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-stone-400 dark:text-zinc-500" />
                    <span className="text-stone-500 dark:text-zinc-400">
                      Latency:
                    </span>
                    <span className="font-mono font-medium text-stone-700 dark:text-zinc-300">
                      {log.latency}ms
                    </span>
                  </div>
                )}
                {log.channel && (
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="h-3 w-3 text-stone-400 dark:text-zinc-500" />
                    <span className="text-stone-500 dark:text-zinc-400">
                      Channel:
                    </span>
                    <span className="font-medium text-stone-700 dark:text-zinc-300">
                      {log.channel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
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
    <div className="flex items-center gap-6 border-b border-dashed border-stone-200 px-4 py-2 dark:border-zinc-700">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 dark:text-zinc-500">
          Live
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-stone-500 dark:text-zinc-400">
          <span className="font-bold text-stone-700 dark:text-zinc-200">
            {logs.length}
          </span>{" "}
          entries
        </span>
        <span className="text-stone-500 dark:text-zinc-400">
          <span className="font-bold text-violet-600 dark:text-violet-400">
            {apiCalls}
          </span>{" "}
          API calls
        </span>
        <span className="text-stone-500 dark:text-zinc-400">
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
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-dashed border-stone-200 px-6 py-3 dark:border-zinc-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 dark:bg-zinc-800">
          <Terminal className="h-4 w-4 text-stone-500 dark:text-zinc-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-stone-800 dark:text-zinc-100">
            Logs
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Real-time activity stream across all Clawd agents
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatsBar logs={filteredLogs} />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        resultCount={filteredLogs.length}
      />

      {/* Content: Log list + Detail panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Log List */}
        <ScrollArea className="flex-1">
          <div>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <LogRow
                  key={log.id}
                  log={log}
                  isSelected={selectedLog?.id === log.id}
                  onClick={() =>
                    setSelectedLog(
                      selectedLog?.id === log.id ? null : log
                    )
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400 dark:text-zinc-500">
                <Terminal className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">No logs match your filters</p>
                <p className="text-xs mt-1">Try adjusting or clearing filters</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Detail Panel */}
        {selectedLog && (
          <DetailPanel
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </div>
    </div>
  );
}
