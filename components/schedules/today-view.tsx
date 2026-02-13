"use client";

import { useMemo } from "react";
import { useCron } from "@/lib/hooks";
import { dayLabels } from "@/lib/schedules-data";
import { parseCron, runsOnDay, formatCronTime, describeCron } from "@/lib/cron-utils";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar } from "lucide-react";

export function TodayView() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];
  const today = new Date().getDay();

  const todayJobs = useMemo(() => {
    return jobs
      .filter((job: any) => job.enabled !== false)
      .map((job: any) => {
        const schedule = job.schedule;
        if (!schedule || schedule.kind !== "cron" || !schedule.expr) {
          return null;
        }
        const parsed = parseCron(schedule.expr);
        if (!parsed || !runsOnDay(parsed, today)) return null;
        return {
          job,
          time: formatCronTime(parsed),
          description: describeCron(schedule.expr, schedule.tz),
        };
      })
      .filter(Boolean) as { job: any; time: string; description: string }[];
  }, [jobs, today]);

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
        ) : todayJobs.length > 0 ? (
          <div className="space-y-2">
            {todayJobs.map((tj) => (
              <div
                key={tj.job.id || tj.job.name}
                className="flex items-center gap-4 rounded-xl bg-stone-100 px-4 py-3 dark:bg-zinc-700"
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {tj.time}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {tj.job.name || "Cron Job"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tj.description}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {tj.job.agentId}
                </span>
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
