"use client";

import { useAgent } from "@/lib/hooks";
import { Panel } from "@/components/shared/panel";
import { StatCard } from "@/components/shared/stat-card";
import { Cpu, Radio, Users } from "lucide-react";

export function OverviewTab({ agentId }: { agentId: string }) {
  const { agent, isLoading } = useAgent(agentId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!agent) return null;

  const stats = [
    { label: "Model", value: agent.model || "—", icon: Cpu, color: "text-blue-500" },
    { label: "Bindings", value: String(agent.bindings || 0), icon: Radio, color: "text-emerald-500" },
    { label: "Role", value: agent.isDefault ? "Lead" : "Agent", icon: Users, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={<span className="text-lg">{stat.value}</span>}
            color={stat.color}
          />
        ))}
      </div>

      <Panel>
        <h3 className="text-sm font-bold text-foreground">About</h3>
        <div className="mt-2 space-y-1.5 text-sm text-dim">
          <p><span className="font-medium text-subtle">Status:</span> {agent.status}</p>
          <p><span className="font-medium text-subtle">Last Active:</span> {agent.lastActive}</p>
          <p><span className="font-medium text-subtle">Workspace:</span> <code className="text-xs">{agent.workspace}</code></p>
        </div>
      </Panel>

      <Panel>
        <h3 className="text-sm font-bold text-foreground">Current Tasks</h3>
        <p className="mt-3 text-xs italic text-muted-foreground">
          No task tracking available yet
        </p>
      </Panel>
    </div>
  );
}
