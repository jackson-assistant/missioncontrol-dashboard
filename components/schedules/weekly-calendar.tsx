"use client";

import { useCron } from "@/lib/hooks";
import { dayLabels } from "@/lib/schedules-data";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";

export function WeeklyCalendar() {
  const { cron, isLoading } = useCron();
  const jobs = cron?.jobs || [];
  const today = new Date().getDay();

  return (
    <div className="mx-6 grid grid-cols-7 gap-2">
      {dayLabels.map((label, dayIndex) => {
        const isToday = dayIndex === today;

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
              {jobs.length === 0 && isToday && (
                <p className="text-[10px] text-muted-foreground">No cron jobs</p>
              )}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
