"use client";

import { useState, useMemo } from "react";
import { useLogs } from "@/lib/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";

interface FeedItem {
  id: string;
  level: string;
  message: string;
  time: string;
  subsystem: string;
  category: "activity" | "system" | "noise";
  icon: string;
  agentHint: string;
}

/** Extract a clean, human-readable summary from a log message */
function cleanMessage(msg: string): string {
  // Strip JSON subsystem prefixes like {"subsystem":"agent/embedded"}
  let clean = msg.replace(/^\{[^}]*\}\s*/, "");
  // Strip runId=xxx, toolCallId=xxx noise
  clean = clean.replace(/\s*runId=[a-f0-9-]+/g, "");
  clean = clean.replace(/\s*toolCallId=[a-zA-Z0-9_-]+/g, "");
  // Strip "embedded run" prefix — just show the action
  clean = clean.replace(/^embedded run\s+/, "");
  // Trim to reasonable length
  if (clean.length > 120) clean = clean.slice(0, 117) + "...";
  return clean;
}

/** Extract agent name hint from log subsystem or message */
function extractAgent(msg: string, subsystem: string): string {
  // Check for agent ID in message
  const agentMatch = msg.match(/agent[=: ]+(\w+)/i);
  if (agentMatch) return agentMatch[1];
  if (subsystem.includes("/")) return subsystem.split("/")[0];
  return subsystem;
}

/** Classify and enrich a log entry */
function classifyLog(log: any): { category: "activity" | "system" | "noise"; icon: string } {
  const msg = (log.message || "").toLowerCase();
  const level = log.level;
  const subsystem = (log.subsystem || "").toLowerCase();

  // Always noise
  if (msg.includes("plugin cli register")) return { category: "noise", icon: "" };
  if (msg.includes("already registered")) return { category: "noise", icon: "" };
  if (msg.includes("already running")) return { category: "noise", icon: "" };
  if (msg.startsWith("{") && !msg.includes("embedded run")) return { category: "noise", icon: "" };
  if (msg.length < 5) return { category: "noise", icon: "" };

  // Debug level — all noise. Agent/tool events are too granular for a feed.
  if (level === "debug") return { category: "noise", icon: "" };

  // Errors and warnings — show but as system
  if (level === "error") return { category: "system", icon: "❌" };
  if (level === "warn") return { category: "system", icon: "⚠️" };

  // Agent activity patterns
  if (msg.includes("session") && (msg.includes("start") || msg.includes("created"))) return { category: "activity", icon: "📋" };
  if (msg.includes("session") && msg.includes("end")) return { category: "activity", icon: "🏁" };
  if (msg.includes("agent") && msg.includes("turn")) return { category: "activity", icon: "🤖" };
  if (msg.includes("agent") && msg.includes("spawn")) return { category: "activity", icon: "🧬" };
  if (msg.includes("message") && (msg.includes("received") || msg.includes("incoming"))) return { category: "activity", icon: "📨" };
  if (msg.includes("message") && (msg.includes("sent") || msg.includes("deliver"))) return { category: "activity", icon: "📤" };
  if (msg.includes("heartbeat")) return { category: "activity", icon: "💓" };
  if (msg.includes("cron") || msg.includes("scheduled")) return { category: "activity", icon: "⏰" };
  if (msg.includes("tool") && (msg.includes("call") || msg.includes("exec"))) return { category: "activity", icon: "🔧" };
  if (msg.includes("channel") && (msg.includes("connect") || msg.includes("start"))) return { category: "activity", icon: "📡" };
  if (msg.includes("gateway") && (msg.includes("start") || msg.includes("ready"))) return { category: "activity", icon: "🟢" };
  if (msg.includes("gateway") && msg.includes("restart")) return { category: "activity", icon: "🔄" };
  if (msg.includes("webhook")) return { category: "activity", icon: "🔗" };
  if (msg.includes("model") && msg.includes("switch")) return { category: "activity", icon: "🔀" };
  if (msg.includes("compaction") || msg.includes("compact")) return { category: "system", icon: "📦" };

  if (level === "info") return { category: "system", icon: "ℹ️" };
  return { category: "noise", icon: "" };
}

export function LiveFeed() {
  const { logs, isLoading: logsLoading } = useLogs();
  const [showAll, setShowAll] = useState(false);

  const feedItems = useMemo(() => {
    return logs
      .map((log: any, i: number) => {
        const { category, icon } = classifyLog(log);
        return {
          id: `feed-${i}`,
          level: log.level,
          message: cleanMessage(log.message || ""),
          time: log.time
            ? new Date(log.time).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
          subsystem: log.subsystem || "system",
          category,
          icon,
          agentHint: extractAgent(log.message || "", log.subsystem || ""),
        };
      })
      .filter((item: FeedItem) => showAll || item.category !== "noise");
  }, [logs, showAll]);

  const activityCount = feedItems.filter(
    (f: FeedItem) => f.category === "activity",
  ).length;

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col border-l border-dashed bg-stone-50/50 dark:bg-zinc-800/60 lg:flex">
      <SectionHeader title="Live Feed" />

      {/* Filter toggle */}
      <div className="flex items-center justify-between border-b border-dashed px-4 py-2">
        <span className="text-[10px] font-medium text-muted-foreground">
          {feedItems.length} entries
          {activityCount > 0 ? ` · ${activityCount} activity` : ""}
        </span>
        <button
          onClick={() => setShowAll(!showAll)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
            showAll
              ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
              : "text-dim hover:bg-stone-200 dark:hover:bg-zinc-800"
          }`}
        >
          {showAll ? "All" : "Activity"}
        </button>
      </div>

      {/* Feed Entries */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200 dark:divide-zinc-800">
          {logsLoading && feedItems.length === 0 ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : feedItems.length > 0 ? (
            feedItems.map((item: FeedItem) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-stone-100/50 dark:hover:bg-zinc-800/50"
              >
                <span className="mt-0.5 w-4 shrink-0 text-center text-xs">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-relaxed text-subtle break-all">
                    {item.message}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="font-medium">{item.agentHint}</span>
                    <span>·</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              message={
                showAll ? "No logs available" : "No agent activity yet"
              }
              hint={
                !showAll ? "Toggle 'All' to see system logs" : undefined
              }
              className="py-8"
            />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
