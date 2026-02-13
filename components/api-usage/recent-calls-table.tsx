"use client";

import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiCall {
  id: string;
  timestamp: number;
  agent_id: string;
  agent_name: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost: number;
  status: string;
  duration_ms: number | null;
}

export function RecentCallsTable({
  calls,
  isLoading,
}: {
  calls: ApiCall[];
  isLoading: boolean;
}) {
  return (
    <Panel padding="none" className="flex-1 overflow-hidden">
      <div className="border-b border-dashed px-4 py-3">
        <h2 className="text-sm font-bold text-foreground">Recent API Calls</h2>
        <p className="text-[11px] text-muted-foreground">
          {calls.length > 0 ? `${calls.length} calls` : "No calls recorded yet"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-muted" />
          ))}
        </div>
      ) : calls.length > 0 ? (
        <ScrollArea className="max-h-[400px]">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">Model</th>
                <th className="px-4 py-2 font-medium text-right">In</th>
                <th className="px-4 py-2 font-medium text-right">Out</th>
                <th className="px-4 py-2 font-medium text-right">Cost</th>
                <th className="px-4 py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-mono text-muted-foreground">
                    {new Date(call.timestamp).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="px-4 py-2 text-subtle">
                    {call.agent_name || call.agent_id}
                  </td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">
                    {call.model}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                    {call.tokens_in.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                    {call.tokens_out.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                    ${call.cost.toFixed(4)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        call.status === "success"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      ) : (
        <EmptyState
          message="No API call data"
          hint="Usage will populate as API calls are tracked"
          className="py-12"
        />
      )}
    </Panel>
  );
}
