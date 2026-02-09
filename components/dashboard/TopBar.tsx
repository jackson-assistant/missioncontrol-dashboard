"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { agents, tasks } from "@/lib/data";
import { FileText } from "lucide-react";

export function TopBar() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAgents = agents.filter((a) => a.status === "WORKING").length;
  const totalTasks = tasks.length;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-dashed border-stone-300 bg-stone-50 px-6 py-3">
      {/* Left: Logo + Product */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐾</span>
          <h1 className="text-sm font-bold tracking-widest text-stone-800 uppercase">
            Mission Control
          </h1>
        </div>
        <Badge
          variant="outline"
          className="rounded-md border-stone-200 bg-stone-100 text-xs text-stone-500"
        >
          Clawd
        </Badge>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-stone-800">{activeAgents}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            Agents Active
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-stone-800">{totalTasks}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            Tasks in Queue
          </span>
        </div>
      </div>

      {/* Right: Docs + Clock + Status */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1.5 rounded-full bg-stone-200/70 px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-300">
          <FileText className="h-3.5 w-3.5" />
          Docs
        </button>
        <div className="flex flex-col items-end">
          {time ? (
            <>
              <span className="font-mono text-lg font-bold leading-tight text-stone-800 tabular-nums">
                {formatTime(time)}
              </span>
              <span className="text-[10px] font-medium tracking-wider text-stone-400">
                {formatDate(time)}
              </span>
            </>
          ) : (
            <span className="font-mono text-lg font-bold text-stone-800">--:--:--</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
