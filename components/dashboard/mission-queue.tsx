"use client";

import { COLUMN_CONFIG } from "@/lib/data";
import type { TaskStatus } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Inbox } from "lucide-react";

const columnDotColors: Record<TaskStatus, string> = {
  inbox: "bg-amber-400",
  assigned: "bg-blue-400",
  in_progress: "bg-violet-400",
  review: "bg-orange-400",
  done: "bg-emerald-400",
};

export function MissionQueue() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <SectionHeader title="Mission Queue" />

      {/* Kanban Columns */}
      <div className="flex flex-1 overflow-hidden">
        {COLUMN_CONFIG.map((col) => (
          <div
            key={col.key}
            className="flex min-w-0 flex-1 flex-col border-r border-dashed last:border-r-0"
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 border-b border-dashed px-3 py-2.5">
              <span
                className={`h-2 w-2 rounded-full ${columnDotColors[col.key]}`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-subtle">
                {col.label}
              </span>
              <Badge
                variant="secondary"
                className="ml-auto flex h-5 min-w-[20px] items-center justify-center bg-secondary/70 p-0 text-[10px] text-dim"
              >
                0
              </Badge>
            </div>

            {/* Empty Column */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {col.key === "inbox" ? (
                  <EmptyState
                    icon={Inbox}
                    message="No tasks yet"
                    hint="Tasks will appear here when created"
                    className="py-8"
                  />
                ) : null}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </section>
  );
}
