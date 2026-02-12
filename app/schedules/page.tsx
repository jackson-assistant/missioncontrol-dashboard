"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlwaysRunningSection } from "@/components/schedules/always-running";
import { WeeklyCalendar } from "@/components/schedules/weekly-calendar";
import { TodayView } from "@/components/schedules/today-view";
import { NextUpSection } from "@/components/schedules/next-up";
import { RotateCw } from "lucide-react";

export default function SchedulesPage() {
  const [view, setView] = useState<"week" | "today">("week");

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Scheduled Tasks
            </h1>
            <p className="text-xs text-muted-foreground">
              Clawd&apos;s automated routines
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border">
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "week"
                    ? "bg-foreground text-background"
                    : "text-dim hover:bg-muted"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("today")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "today"
                    ? "bg-foreground text-background"
                    : "text-dim hover:bg-muted"
                }`}
              >
                Today
              </button>
            </div>
            <Button variant="ghost" size="icon-sm">
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <AlwaysRunningSection />
        {view === "week" ? <WeeklyCalendar /> : <TodayView />}
        <NextUpSection />
      </div>
    </ScrollArea>
  );
}
