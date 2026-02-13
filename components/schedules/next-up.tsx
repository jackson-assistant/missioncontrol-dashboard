"use client";

import { useCron } from "@/lib/hooks";
import { describeCron } from "@/lib/cron-utils";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar } from "lucide-react";

export function NextUpSection() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];

  // Sort by next run time
  const sorted = [...jobs]
    .filter((j: any) => j.enabled !== false)
    .sort((a: any, b: any) => {
      const aNext = a.state?.nextRunAtMs || Infinity;
      const bNext = b.state?.nextRunAtMs || Infinity;
      return aNext - bNext;
    });

  return (
    <Panel className="mx-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-dim" />
        <h2 className="text-sm font-bold text-foreground">Next Up</h2>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <div className="h-8 animate-pulse rounded bg-muted" />
        ) : sorted.length > 0 ? (
          <div className="divide-y divide-dashed">
            {sorted.map((job: any) => {
              const schedule = job.schedule;
              const scheduleLabel =
                schedule?.kind === "cron" && schedule.expr
                  ? describeCron(schedule.expr, schedule.tz)
                  : schedule?.kind === "at"
                    ? new Date(schedule.at).toLocaleString()
                    : schedule?.everyMs
                      ? `Every ${Math.round(schedule.everyMs / 60000)}m`
                      : "—";

              const nextRun = job.state?.nextRunAtMs
                ? new Date(job.state.nextRunAtMs).toLocaleString("en-AU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "short",
                  })
                : null;

              return (
                <div key={job.id || job.name} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-subtle">
                      {job.name || "Cron Job"}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{scheduleLabel}</p>
                  </div>
                  {nextRun && (
                    <span className="shrink-0 text-xs font-mono text-muted-foreground">
                      next: {nextRun}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No scheduled jobs" className="py-4" />
        )}
      </div>
    </Panel>
  );
}
