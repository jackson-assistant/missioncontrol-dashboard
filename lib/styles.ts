import type { AgentRole, AgentStatus } from "./data";

/** Role badge color classes — used by RoleBadge, AgentsPanel, agent profile */
export const roleStyles: Record<AgentRole, string> = {
  LEAD: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  INT: "border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-400",
  SPC: "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400",
};

/** Status dot background classes */
export const statusDotColors: Record<AgentStatus, string> = {
  WORKING: "bg-emerald-500",
  IDLE: "bg-amber-500",
  OFFLINE: "bg-stone-400 dark:bg-zinc-600",
};

/** Status label text color classes */
export const statusTextColors: Record<AgentStatus, string> = {
  WORKING: "text-emerald-600 dark:text-emerald-400",
  IDLE: "text-amber-600 dark:text-amber-400",
  OFFLINE: "text-stone-500 dark:text-zinc-500",
};
