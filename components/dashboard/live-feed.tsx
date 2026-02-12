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
}

/** Classify a log entry as meaningful activity vs noise */
function classifyLog(log: any): "activity" | "system" | "noise" {
  const msg = (log.message || "").trim();
  const msgLower = msg.toLowerCase();
  const level = log.level;

  // Skip debug-level noise
  if (level === "debug") return "noise";

  // Skip error spam (gateway restart attempts, port conflicts, etc.)
  if (level === "error") return "noise";

  // Skip warning noise
  if (level === "warn") return "noise";

  // Skip messages that are JSON objects/arrays (CLI stdout captured as logs)
  if (msg.startsWith("{") || msg.startsWith("[") || msg.startsWith("{\n")) return "noise";

  // Skip very short or empty messages
  if (msg.length < 5) return "noise";

  // Skip CLI output patterns
  if (msgLower.includes("openclaw") && (msgLower.includes("gateway stop") || msgLower.includes("systemctl"))) return "noise";
  if (msgLower.includes("plugin cli register")) return "noise";
  if (msgLower.includes("already running") || msgLower.includes("already registered")) return "noise";
  if (msgLower.includes("port") && msgLower.includes("in use")) return "noise";

  // Meaningful activity patterns
  if (msgLower.includes("session") && (msgLower.includes("start") || msgLower.includes("end") || msgLower.includes("created"))) return "activity";
  if (msgLower.includes("agent") && (msgLower.includes("turn") || msgLower.includes("run") || msgLower.includes("spawn"))) return "activity";
  if (msgLower.includes("message") && (msgLower.includes("received") || msgLower.includes("sent") || msgLower.includes("deliver"))) return "activity";
  if (msgLower.includes("heartbeat")) return "activity";
  if (msgLower.includes("cron") || msgLower.includes("scheduled")) return "activity";
  if (msgLower.includes("tool") && (msgLower.includes("call") || msgLower.includes("exec"))) return "activity";
  if (msgLower.includes("channel") && (msgLower.includes("connect") || msgLower.includes("start") || msgLower.includes("stop"))) return "activity";
  if (msgLower.includes("gateway") && (msgLower.includes("start") || msgLower.includes("ready") || msgLower.includes("restart"))) return "activity";
  if (msgLower.includes("webhook")) return "activity";
  if (msgLower.includes("model") && msgLower.includes("switch")) return "activity";

  // Remaining info that isn't caught — show as system only if not JSON-like
  if (level === "info") return "system";

  return "noise";
}

export function LiveFeed() {
  const { logs, isLoading: logsLoading } = useLogs();
  const [showAll, setShowAll] = useState(false);

  const feedItems = useMemo(() => {
    return logs
      .map((log: any, i: number) => ({
        id: `feed-${i}`,
        level: log.level,
        message: log.message,
        time: log.time
          ? new Date(log.time).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "",
        subsystem: log.subsystem || "system",
        category: classifyLog(log),
      }))
      .filter((item: FeedItem) => showAll || item.category !== "noise");
  }, [logs, showAll]);

  const levelDot: Record<string, string> = {
    error: "bg-rose-500",
    warn: "bg-amber-500",
    debug: "bg-stone-400",
    info: "bg-blue-400",
  };

  const activityCount = feedItems.filter((f: FeedItem) => f.category === "activity").length;

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col border-l border-dashed bg-stone-50/50 dark:bg-zinc-800/60 lg:flex">
      <SectionHeader title="Live Feed" />

      {/* Filter toggle */}
      <div className="flex items-center justify-between border-b border-dashed px-4 py-2">
        <span className="text-[10px] font-medium text-muted-foreground">
          {feedItems.length} entries{activityCount > 0 ? ` · ${activityCount} activity` : ""}
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
                <div key={i} className="h-8 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : feedItems.length > 0 ? (
            feedItems.map((item: FeedItem) => (
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
            <EmptyState
              message={showAll ? "No logs available" : "No agent activity yet"}
              hint={!showAll ? "Toggle 'All' to see system logs" : undefined}
              className="py-8"
            />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
