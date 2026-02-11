"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { agents, tasks } from "@/lib/data";
import { FileText, LayoutDashboard, Activity, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/api-usage", label: "API Usage", icon: Activity },
  { href: "/logs", label: "Logs", icon: Terminal },
];

export function TopBar() {
  const pathname = usePathname();
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
    <header className="flex items-center justify-between border-b border-dashed border-stone-300 bg-stone-50 px-6 py-3 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Left: Logo + Product + Nav */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐾</span>
          <h1 className="text-sm font-bold uppercase tracking-widest text-stone-800 dark:text-zinc-100">
            Mission Control
          </h1>
        </div>
        <Badge
          variant="outline"
          className="rounded-md border-stone-200 bg-stone-100 text-xs text-stone-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
        >
          Clawd
        </Badge>

        <div className="mx-1 h-5 w-px bg-stone-300 dark:bg-zinc-700" />

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "text-stone-500 hover:bg-stone-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-stone-800 dark:text-zinc-100">
            {activeAgents}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            Agents Active
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-stone-800 dark:text-zinc-100">
            {totalTasks}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            Tasks in Queue
          </span>
        </div>
      </div>

      {/* Right: Docs + Theme + Clock + Status */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 rounded-full bg-stone-200/70 px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
          <FileText className="h-3.5 w-3.5" />
          Docs
        </button>
        <ThemeToggle />
        <div className="flex flex-col items-end">
          {time ? (
            <>
              <span className="font-mono text-lg font-bold leading-tight text-stone-800 tabular-nums dark:text-zinc-100">
                {formatTime(time)}
              </span>
              <span className="text-[10px] font-medium tracking-wider text-stone-400 dark:text-zinc-500">
                {formatDate(time)}
              </span>
            </>
          ) : (
            <span className="font-mono text-lg font-bold text-stone-800 dark:text-zinc-100">
              --:--:--
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
