"use client";

import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";

interface AgentUsage {
  agent_id: string;
  agent_name: string;
  total_calls: number;
  total_tokens: number;
  total_cost: number;
}

export function UsageByAgent({
  byAgent,
  isLoading,
}: {
  byAgent: AgentUsage[];
  isLoading: boolean;
}) {
  const maxCost = Math.max(...byAgent.map((a) => a.total_cost), 0.01);

  return (
    <Panel>
      <h2 className="text-sm font-bold text-foreground">Usage by Agent</h2>
      <div className="mt-4 space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))
        ) : byAgent.length > 0 ? (
          byAgent.map((agent) => (
            <div key={agent.agent_id}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-subtle">
                  {agent.agent_name || agent.agent_id}
                </span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>{agent.total_calls} calls</span>
                  <span>
                    {agent.total_tokens >= 1000
                      ? `${(agent.total_tokens / 1000).toFixed(0)}K`
                      : agent.total_tokens}{" "}
                    tokens
                  </span>
                  <span className="font-medium text-foreground">
                    ${agent.total_cost.toFixed(4)}
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${(agent.total_cost / maxCost) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            message="No usage data yet"
            hint="API calls will appear here once tracked"
            className="py-6"
          />
        )}
      </div>
    </Panel>
  );
}
