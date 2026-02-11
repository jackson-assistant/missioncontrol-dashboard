"use client";

import { useState } from "react";
import {
  alwaysRunning,
  nextUp,
  dayLabels,
  getTasksForDay,
  type CalendarTask,
} from "@/lib/schedules-data";
import { agents, getAgentColor, hexToRgb } from "@/lib/data";
import { Panel } from "@/components/dashboard/ui/panel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Calendar, RotateCw } from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function AgentDot({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return null;
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full text-[6px] font-bold leading-3 text-center text-white"
      style={{ backgroundColor: agent.color }}
      title={agent.name}
    >
      {agent.avatar}
    </span>
  );
}

/** Pill style derived from an agent's hex color */
function agentPillStyle(agentId: string) {
  const hex = getAgentColor(agentId);
  const { r, g, b } = hexToRgb(hex);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
    color: hex,
  };
}

// ── Calendar Block (compact, for weekly grid) ───────────────────────────────

function TaskBlock({ task }: { task: CalendarTask }) {
  const color = getAgentColor(task.agentId);

  return (
    <div
      className="rounded-lg px-2.5 py-1.5"
      style={{ backgroundColor: color + "CC" }} // ~80% opacity
    >
      <p className="truncate text-[11px] font-medium text-white">
        {task.name}
      </p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <AgentDot agentId={task.agentId} />
        <span className="truncate text-[9px] text-white/60">
          {task.agentName}
        </span>
        <span className="ml-auto text-[9px] text-white/70">{task.time}</span>
      </div>
    </div>
  );
}

// ── Today Card (expanded, for today view) ───────────────────────────────────

function TodayCard({ task }: { task: CalendarTask }) {
  const agent = agents.find((a) => a.id === task.agentId);
  const color = agent?.color ?? "#71717A";

  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3"
      style={{ backgroundColor: color + "CC" }}
    >
      {/* Agent avatar */}
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {agent?.avatar ?? "?"}
      </span>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {task.name}
        </p>
        <p className="text-xs text-white/70">{task.agentName}</p>
      </div>

      {/* Time */}
      <span className="shrink-0 text-sm font-bold text-white/90">
        {task.time}
      </span>
    </div>
  );
}

// ── Always Running ──────────────────────────────────────────────────────────

function AlwaysRunningSection() {
  return (
    <Panel className="mx-6">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-bold text-foreground">Always Running</h2>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {alwaysRunning.map((task) => (
          <span
            key={task.id}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={agentPillStyle(task.agentId)}
          >
            {task.name} &bull; {task.interval}
          </span>
        ))}
      </div>
    </Panel>
  );
}

// ── Weekly Calendar Grid ────────────────────────────────────────────────────

function WeeklyCalendar() {
  const today = new Date().getDay();

  return (
    <div className="mx-6 grid grid-cols-7 gap-2">
      {dayLabels.map((label, dayIndex) => {
        const tasks = getTasksForDay(dayIndex);
        const isToday = dayIndex === today;

        return (
          <Panel
            key={label}
            padding="none"
            className={`flex min-h-[220px] flex-col overflow-hidden ${
              isToday ? "ring-1 ring-amber-500/50" : ""
            }`}
          >
            {/* Day Header */}
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

            {/* Task Blocks */}
            <div className="flex flex-1 flex-col gap-1.5 p-2">
              {tasks.map((task) => (
                <TaskBlock key={task.id} task={task} />
              ))}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

// ── Today View ──────────────────────────────────────────────────────────────

function TodayView() {
  const today = new Date().getDay();
  const tasks = getTasksForDay(today);

  return (
    <div className="mx-6 space-y-4">
      <Panel>
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-foreground">
            {dayLabels[today]}&apos;s Schedule
          </h2>
          <span className="text-xs text-muted-foreground">
            {tasks.length} tasks
          </span>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TodayCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No scheduled tasks for today
          </p>
        )}
      </Panel>
    </div>
  );
}

// ── Next Up ─────────────────────────────────────────────────────────────────

function NextUpSection() {
  return (
    <Panel className="mx-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-dim" />
        <h2 className="text-sm font-bold text-foreground">Next Up</h2>
      </div>
      <div className="mt-3 divide-y divide-dashed">
        {nextUp.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between py-2.5"
          >
            <div className="flex items-center gap-2">
              <AgentDot agentId={entry.agentId} />
              <span
                className="text-sm font-medium"
                style={{ color: getAgentColor(entry.agentId) }}
              >
                {entry.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{entry.eta}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function SchedulesPage() {
  const [view, setView] = useState<"week" | "today">("week");

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
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
