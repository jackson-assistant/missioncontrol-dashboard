// ── Types ────────────────────────────────────────────────────────────────────

export type AgentRole = "LEAD" | "INT" | "SPC";
export type AgentStatus = "WORKING" | "IDLE" | "OFFLINE";
export type TaskStatus = "inbox" | "in_progress" | "review" | "done";
export type FeedType = "comment" | "task" | "status";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  title: string;
  avatar: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  tags: string[];
  createdAt: string;
}

export interface FeedEntry {
  id: string;
  agentId: string;
  type: FeedType;
  content: string;
  timestamp: string;
}

// ── Agent Color Palette (15 rainbow-spaced, white-text safe) ─────────────────

export const agentPalette = [
  "#EF4444", //  1 — Red
  "#3B82F6", //  2 — Blue
  "#22C55E", //  3 — Green
  "#F97316", //  4 — Orange
  "#8B5CF6", //  5 — Violet
  "#06B6D4", //  6 — Cyan
  "#EC4899", //  7 — Pink
  "#D97706", //  8 — Amber
  "#6366F1", //  9 — Indigo
  "#14B8A6", // 10 — Teal
  "#D946EF", // 11 — Fuchsia
  "#0EA5E9", // 12 — Sky
  "#65A30D", // 13 — Lime
  "#F43F5E", // 14 — Rose
  "#A855F7", // 15 — Purple
] as const;

// ── Color Helpers ────────────────────────────────────────────────────────────

/** Parse a hex color to {r, g, b} */
export function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

/** Get an agent's color by index */
export function getAgentColorByIndex(index: number): string {
  return agentPalette[index % agentPalette.length];
}

/** Map a live API agent to our Agent type */
export function mapApiAgent(apiAgent: any): Agent {
  const name = apiAgent.name || apiAgent.id;
  const initials = name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .map((w: string) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2) || apiAgent.id.slice(0, 2).toUpperCase();

  return {
    id: apiAgent.id,
    name,
    role: apiAgent.role || (apiAgent.isDefault ? "LEAD" : "INT"),
    status: apiAgent.status || "OFFLINE",
    title: apiAgent.model || "Agent",
    avatar: initials,
    color: getAgentColorByIndex(apiAgent.index ?? 0),
  };
}

/** Column definitions for the kanban board */
export const COLUMN_CONFIG: { key: TaskStatus; label: string }[] = [
  { key: "inbox", label: "INBOX" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "review", label: "REVIEW" },
  { key: "done", label: "DONE" },
];
