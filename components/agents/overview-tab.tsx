"use client";

import { useAgent, useTasks } from "@/lib/hooks";
import { Panel } from "@/components/shared/panel";
import { StatCard } from "@/components/shared/stat-card";
import { Cpu, Radio, Users } from "lucide-react";

export function OverviewTab({ agentId }: { agentId: string }) {
  const { agent, isLoading } = useAgent(agentId);
  const { tasks } = useTasks();
  const agentTasks = tasks.filter((t: any) => t.assignee_id === agentId);

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
        {agentTasks.length > 0 ? (
          <div className="mt-3 space-y-2">
            {agentTasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{task.title}</p>
                  {task.description && (
                    <p className="truncate text-[11px] text-muted-foreground">{task.description}</p>
                  )}
                </div>
                <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                  task.status === "done" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  task.status === "in_progress" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" :
                  task.status === "review" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs italic text-muted-foreground">
            No tasks assigned to this agent
          </p>
        )}
      </Panel>
    </div>
  );
}
