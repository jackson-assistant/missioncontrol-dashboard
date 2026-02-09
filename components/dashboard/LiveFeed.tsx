"use client";

import { useState } from "react";
import { feedEntries, agents, getAgentById } from "@/lib/data";
import type { FeedEntry } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

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
    <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-100/50">
      <Avatar size="sm">
        <AvatarFallback
          style={{ backgroundColor: agent.color, color: "white" }}
          className="text-[9px] font-bold"
        >
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-relaxed text-stone-700">{entry.content}</p>
        <span className="mt-0.5 block text-[10px] text-stone-400">
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

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-dashed border-stone-300 bg-stone-50/50">
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b border-dashed border-stone-300 px-4 py-3">
        <span className="text-xs text-amber-500">✦</span>
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-800">
          Live Feed
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-dashed border-stone-200 px-4 py-2">
        {feedTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-stone-800 text-white"
                : "text-stone-500 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agent Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-dashed border-stone-200 px-4 py-2">
        <button
          onClick={() => setActiveAgent(null)}
          className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
            !activeAgent
              ? "border-amber-200 bg-amber-100 text-amber-700"
              : "border-stone-200 bg-stone-100 text-stone-500 hover:bg-stone-200"
          }`}
        >
          All Agents
        </button>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() =>
              setActiveAgent(agent.id === activeAgent ? null : agent.id)
            }
            className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
              activeAgent === agent.id
                ? "border-amber-200 bg-amber-100 text-amber-700"
                : "border-stone-200 bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
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
        <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-500 transition-colors hover:bg-stone-300">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Feed Entries */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <FeedItem key={entry.id} entry={entry} />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-xs text-stone-400">
              No activity to show
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
