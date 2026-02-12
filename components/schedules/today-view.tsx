"use client";

import { useCron } from "@/lib/hooks";
import { dayLabels } from "@/lib/schedules-data";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar } from "lucide-react";

export function TodayView() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];
  const today = new Date().getDay();

  return (
    <div className="mx-6 space-y-4">
      <Panel>
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-foreground">
            {dayLabels[today]}&apos;s Schedule
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-2">
            {jobs.map((job: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl bg-stone-100 px-4 py-3 dark:bg-zinc-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {job.name || job.command || "Cron Job"}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {typeof job.schedule === "string"
                      ? job.schedule
                      : job.schedule?.expr || job.schedule?.at || (job.schedule?.everyMs ? `every ${Math.round(job.schedule.everyMs / 60000)}m` : null) || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No scheduled tasks for today" className="py-8" />
        )}
      </Panel>
    </div>
  );
}
