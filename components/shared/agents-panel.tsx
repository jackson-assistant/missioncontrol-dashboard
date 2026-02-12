"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAgents } from "@/lib/hooks";
import { mapApiAgent } from "@/lib/data";
import type { Agent } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionHeader } from "@/components/shared/section-header";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatusDot } from "@/components/shared/status-dot";

function AgentRow({ agent, isActive }: { agent: Agent; isActive: boolean }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-100/50 dark:hover:bg-zinc-800/50 ${
        isActive
          ? "border-l-2 border-l-amber-500 bg-stone-100/70 dark:bg-zinc-800/70"
          : "border-l-2 border-l-transparent"
      }`}
    >
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
          <span className="truncate text-sm font-semibold text-foreground">
            {agent.name}
          </span>
          <RoleBadge role={agent.role} />
        </div>
        <StatusDot status={agent.status} size="xs" label className="mt-0.5" />
        <p className="mt-0.5 truncate text-xs text-dim">
          {agent.title}
        </p>
      </div>
    </Link>
  );
}

export function AgentsPanel() {
  const pathname = usePathname();
  const { agents: rawAgents, isLoading } = useAgents();
  const agents = rawAgents.map(mapApiAgent);

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-dashed bg-stone-50/50 dark:bg-zinc-800/60">
      <SectionHeader title="Agents" badge={agents.length} />
      <ScrollArea className="flex-1">
        <div className="divide-y divide-dashed divide-stone-200 dark:divide-zinc-800">
          {isLoading && agents.length === 0 ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : (
            agents.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isActive={pathname === `/agents/${agent.id}`}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
