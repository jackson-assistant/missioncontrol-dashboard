"use client";

import { useState } from "react";
import { feedEntries, agents, getAgentById } from "@/lib/data";
import type { FeedEntry } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "./ui/section-header";
import { EmptyState } from "./ui/empty-state";

const feedTabs = [
  { key: "all", label: "All" },
  { key: "task", label: "Tasks" },
  { key: "comment", label: "Comments" },
  { key: "status", label: "Status" },
] as const;

function FeedItem({ entry }: { entry: FeedEntry }) {
  const agent = getAgentById(entry.agentId);
  if (!agent) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-100/50 dark:hover:bg-zinc-800/50">
      <Avatar size="sm">
        <AvatarFallback
          style={{ backgroundColor: agent.color, color: "white" }}
          className="text-[9px] font-bold"
        >
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-relaxed text-subtle">
          {entry.content}
        </p>
        <span className="mt-0.5 block text-[10px] text-muted-foreground">
          {agent.name} &middot; {entry.timestamp}
        </span>
      </div>
    </div>
  );
}

export function LiveFeed() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const filteredEntries = feedEntries.filter((entry) => {
    if (activeTab !== "all" && entry.type !== activeTab) return false;
    if (activeAgent && entry.agentId !== activeAgent) return false;
    return true;
  });

  const agentCounts = agents.reduce(
    (acc, agent) => {
      acc[agent.id] = feedEntries.filter((e) => e.agentId === agent.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const tabClass = (isActive: boolean) =>
    `rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
      isActive
        ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
        : "text-dim hover:bg-stone-200 dark:hover:bg-zinc-800"
    }`;

  const pillClass = (isActive: boolean) =>
    `flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
      isActive
        ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
        : "border-stone-200 bg-muted text-dim hover:bg-stone-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
    }`;

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-dashed bg-stone-50/50 dark:bg-zinc-800/60">
      <SectionHeader title="Live Feed" />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-dashed px-4 py-2">
        {feedTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={tabClass(activeTab === tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agent Filter Pills */}
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto border-b border-dashed px-4 py-2">
        <button
          onClick={() => setActiveAgent(null)}
          className={pillClass(!activeAgent)}
        >
          All Agents
        </button>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() =>
              setActiveAgent(agent.id === activeAgent ? null : agent.id)
            }
            className={pillClass(activeAgent === agent.id)}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.color }}
            />
            {agent.name}
            {agentCounts[agent.id] > 0 && (
              <span className="opacity-60">{agentCounts[agent.id]}</span>
            )}
          </button>
        ))}
        <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-dim transition-colors hover:bg-stone-300 dark:hover:bg-zinc-600">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Feed Entries */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200 dark:divide-zinc-800">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <FeedItem key={entry.id} entry={entry} />
            ))
          ) : (
            <EmptyState message="No activity to show" className="py-8" />
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
