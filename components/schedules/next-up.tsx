"use client";

import { useCron } from "@/lib/hooks";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar } from "lucide-react";

export function NextUpSection() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];

  return (
    <Panel className="mx-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-dim" />
        <h2 className="text-sm font-bold text-foreground">Next Up</h2>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <div className="h-8 animate-pulse rounded bg-muted" />
        ) : jobs.length > 0 ? (
          <div className="divide-y divide-dashed">
            {jobs.map((job: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium text-subtle">
                  {job.name || job.command || "Cron Job"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {typeof job.schedule === "string"
                    ? job.schedule
                    : job.schedule?.expr || job.schedule?.at || (job.schedule?.everyMs ? `every ${Math.round(job.schedule.everyMs / 60000)}m` : null) || job.nextRun || "—"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No scheduled jobs" className="py-4" />
        )}
      </div>
    </Panel>
  );
}
