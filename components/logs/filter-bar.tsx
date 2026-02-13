"use client";

import {
  actionLabels,
  type LogLevel,
  type LogAction,
} from "@/lib/logs-data";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export interface LogFilters {
  agentId: string | null;
  level: LogLevel | null;
  action: LogAction | null;
  search: string;
}

const selectClass =
  "rounded-md border bg-card px-2 py-1 text-[11px] font-medium text-subtle outline-none";

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: LogFilters;
  onChange: (f: LogFilters) => void;
  resultCount: number;
}) {
  const hasFilters =
    filters.agentId || filters.level || filters.action || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-dashed px-4 py-2.5">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />

      <select
        value={filters.level ?? ""}
        onChange={(e) => onChange({ ...filters, level: (e.target.value as LogLevel) || null })}
        className={selectClass}
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
