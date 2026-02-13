"use client";

import { useMemo } from "react";
import { useCron } from "@/lib/hooks";
import { dayLabels } from "@/lib/schedules-data";
import { parseCron, runsOnDay, formatCronTime, describeCron } from "@/lib/cron-utils";
import { Panel } from "@/components/shared/panel";

export function WeeklyCalendar() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];
  const today = new Date().getDay();

  // Parse all cron jobs and determine which days they run on
  const parsedJobs = useMemo(() => {
    return jobs
      .filter((job: any) => job.enabled !== false)
      .map((job: any) => {
        const schedule = job.schedule;
        if (!schedule || schedule.kind !== "cron" || !schedule.expr) {
          return { job, parsed: null, time: "—", description: "—" };
        }
        const parsed = parseCron(schedule.expr);
        return {
          job,
          parsed,
          time: parsed ? formatCronTime(parsed) : "—",
          description: describeCron(schedule.expr, schedule.tz),
        };
      });
  }, [jobs]);

  return (
    <div className="mx-6 grid grid-cols-7 gap-2">
      {dayLabels.map((label, dayIndex) => {
        const isToday = dayIndex === today;
        const dayJobs = parsedJobs.filter(
          (pj: any) => pj.parsed && runsOnDay(pj.parsed, dayIndex)
        );

        return (
          <Panel
            key={label}
            padding="none"
            className={`flex min-h-[220px] flex-col overflow-hidden ${
              isToday ? "ring-1 ring-amber-500/50" : ""
            }`}
          >
            <div className="border-b border-dashed px-3 py-2">
              <span
                className={`text-xs font-bold ${
                  isToday ? "text-amber-500" : "text-foreground"
                }`}
              >
                {label}
              </span>
              {isToday && (
                <span className="ml-1.5 text-[9px] font-medium text-amber-500/70">
                  TODAY
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-2">
              {isLoading ? (
                <div className="h-8 animate-pulse rounded bg-muted" />
              ) : dayJobs.length > 0 ? (
                dayJobs.map((pj: any) => (
                  <div
                    key={pj.job.id || pj.job.name}
                    className="rounded-md bg-stone-100 px-2 py-1.5 dark:bg-zinc-700"
                  >
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {pj.time}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-medium text-foreground">
                      {pj.job.name || "Cron Job"}
                    </p>
                    <p className="truncate text-[9px] text-muted-foreground">
                      {pj.job.agentId || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-muted-foreground">—</p>
              )}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
