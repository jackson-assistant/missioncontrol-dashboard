"use client";

import { useState } from "react";
import { useAgents, useLogs } from "@/lib/hooks";
import { mapApiAgent } from "@/lib/data";
import { mapGatewayLog } from "@/lib/logs-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";

interface FeedItem {
  id: string;
  level: string;
  message: string;
  time: string;
  subsystem: string;
}

export function LiveFeed() {
  const { logs, isLoading: logsLoading } = useLogs();
  const { agents: rawAgents } = useAgents();
  const agents = rawAgents.map(mapApiAgent);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const feedItems = logs.map((log: any, i: number) => ({
    id: `feed-${i}`,
    level: log.level,
    message: log.message,
    time: log.time ? new Date(log.time).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "",
    subsystem: log.subsystem || "system",
  }));

  const filtered = activeLevel
    ? feedItems.filter((f: FeedItem) => f.level === activeLevel)
    : feedItems;

  const levelTabs = [
    { key: null, label: "All" },
    { key: "error", label: "Errors" },
    { key: "warn", label: "Warnings" },
    { key: "debug", label: "Debug" },
  ] as const;

  const tabClass = (isActive: boolean) =>
    `rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
      isActive
        ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
        : "text-dim hover:bg-stone-200 dark:hover:bg-zinc-800"
    }`;

  const levelDot: Record<string, string> = {
    error: "bg-rose-500",
    warn: "bg-amber-500",
    debug: "bg-stone-400",
    info: "bg-blue-400",
  };

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-dashed bg-stone-50/50 dark:bg-zinc-800/60">
      <SectionHeader title="Live Feed" />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-dashed px-4 py-2">
        {levelTabs.map((tab) => (
          <button
            key={tab.key ?? "all"}
            onClick={() => setActiveLevel(tab.key)}
            className={tabClass(activeLevel === tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Entries */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200 dark:divide-zinc-800">
          {logsLoading && filtered.length === 0 ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((item: FeedItem) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-100/50 dark:hover:bg-zinc-800/50"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${levelDot[item.level] || "bg-stone-400"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-subtle break-all">
                    {item.message}
                  </p>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    {item.subsystem} &middot; {item.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="No activity to show" className="py-8" />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
