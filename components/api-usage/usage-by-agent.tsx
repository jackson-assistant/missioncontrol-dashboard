"use client";

import { useAgents } from "@/lib/hooks";
import { mapApiAgent } from "@/lib/data";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";

export function UsageByAgent() {
  const { agents: rawAgents, isLoading } = useAgents();
  const agents = rawAgents.map(mapApiAgent);

  return (
    <Panel>
      <h2 className="text-sm font-bold text-foreground">Usage by Agent</h2>
      <p className="text-xs text-muted-foreground">
        API usage tracking not yet available
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded bg-muted" />
          ))
        ) : agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.id} className="text-center">
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: agent.color }}
              >
                {agent.avatar}
              </div>
              <p className="mt-1.5 text-xs font-medium text-subtle">
                {agent.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {agent.status}
              </p>
            </div>
          ))
        ) : (
          <EmptyState message="No agents" className="col-span-3 py-4" />
        )}
      </div>
    </Panel>
  );
}
