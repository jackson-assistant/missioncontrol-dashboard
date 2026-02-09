"use client";

import { agents } from "@/lib/data";
import type { Agent } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const roleStyles: Record<string, string> = {
  LEAD: "border-amber-200 bg-amber-100 text-amber-700",
  INT: "border-indigo-200 bg-indigo-100 text-indigo-700",
  SPC: "border-rose-200 bg-rose-100 text-rose-700",
};

const statusColors: Record<string, string> = {
  WORKING: "bg-emerald-500",
  IDLE: "bg-amber-500",
  OFFLINE: "bg-stone-400",
};

function AgentRow({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-100/50">
      <Avatar size="lg">
        <AvatarFallback
          style={{ backgroundColor: agent.color, color: "white" }}
          className="text-xs font-bold"
        >
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-stone-800">
            {agent.name}
          </span>
          <Badge
            variant="outline"
            className={`border px-1.5 py-0 text-[10px] ${roleStyles[agent.role]}`}
          >
            {agent.role}
          </Badge>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusColors[agent.status]}`}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            {agent.status}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-stone-500">{agent.title}</p>
      </div>
    </div>
  );
}

export function AgentsPanel() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-dashed border-stone-300 bg-stone-50/50">
      <div className="flex items-center gap-2 border-b border-dashed border-stone-300 px-4 py-3">
        <span className="text-xs text-amber-500">✦</span>
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-800">
          Agents
        </h2>
        <Badge
          variant="secondary"
          className="ml-auto flex h-5 w-5 items-center justify-center bg-stone-200 p-0 text-[10px] text-stone-500"
        >
          {agents.length}
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200">
          {agents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
