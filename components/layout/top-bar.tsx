"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAgents } from "@/lib/hooks";
import { mapApiAgent } from "@/lib/data";
import { FileText, LayoutDashboard, Activity, Terminal, CalendarClock, Settings, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/api-usage", label: "API Usage", icon: Activity },
  { href: "/logs", label: "Logs", icon: Terminal },
  { href: "/schedules", label: "Schedules", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TopBar() {
  const pathname = usePathname();
  const [time, setTime] = useState<Date | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const { agents: rawAgents } = useAgents();
  const agents = rawAgents.map(mapApiAgent);
  const activeAgents = agents.filter((a) => a.status === "WORKING").length;
  const totalTasks = 0;

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
    <header className="relative border-b border-dashed bg-background">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile menu toggle */}
          <button
            className="rounded-md p-1.5 text-dim hover:bg-muted md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <h1 className="text-sm font-bold uppercase tracking-widest text-foreground">
              <span className="hidden sm:inline">Mission Control</span>
              <span className="sm:hidden">MC</span>
            </h1>
          </div>
          <Badge
            variant="outline"
            className="hidden rounded-md border-input bg-accent text-xs text-dim sm:inline-flex"
          >
            Clawd
          </Badge>

          <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
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
                      : "text-dim hover:bg-stone-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Stats (hidden on small screens) */}
        <div className="hidden items-center gap-12 lg:flex">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">
              {activeAgents}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Agents Active
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">
              {totalTasks}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Tasks in Queue
            </span>
          </div>
        </div>

        {/* Right: Docs + Theme + Clock + Status */}
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href="https://docs.openclaw.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full bg-stone-200/70 text-xs text-subtle hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Docs</span>
            </Button>
          </a>
          <ThemeToggle />
          <div className="hidden flex-col items-end sm:flex">
            {time ? (
              <>
                <span className="font-mono text-lg font-bold leading-tight text-foreground tabular-nums">
                  {formatTime(time)}
                </span>
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                  {formatDate(time)}
                </span>
              </>
            ) : (
              <span className="font-mono text-lg font-bold text-foreground">
                --:--:--
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="hidden text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 sm:inline">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-dashed bg-background shadow-lg md:hidden">
          <nav className="flex flex-col p-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "text-dim hover:bg-stone-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {/* Mobile stats */}
          <div className="flex items-center gap-6 border-t border-dashed px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{activeAgents}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{totalTasks}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Queued</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
