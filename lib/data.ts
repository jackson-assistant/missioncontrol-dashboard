// ── Types ────────────────────────────────────────────────────────────────────

export type AgentRole = "LEAD" | "INT" | "SPC";
export type AgentStatus = "WORKING" | "IDLE" | "OFFLINE";
export type TaskStatus = "inbox" | "assigned" | "in_progress" | "review" | "done";
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
// Ordered for maximum early distinction: first 7 span the full spectrum.
// Future agents just take the next slot.

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

/** Get an agent's color by id (falls back to neutral gray) */
export function getAgentColor(agentId: string): string {
  return agents.find((a) => a.id === agentId)?.color ?? "#71717A";
}

// ── Agents ───────────────────────────────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: "clawdlead",
    name: "ClawdLead",
    role: "LEAD",
    status: "WORKING",
    title: "Founder",
    avatar: "CL",
    color: agentPalette[0], // Red
  },
  {
    id: "devbot",
    name: "DevBot",
    role: "INT",
    status: "WORKING",
    title: "Developer Agent",
    avatar: "DB",
    color: agentPalette[1], // Blue
  },
  {
    id: "researchbot",
    name: "ResearchBot",
    role: "SPC",
    status: "WORKING",
    title: "Customer Research",
    avatar: "RB",
    color: agentPalette[2], // Green
  },
  {
    id: "squadbot",
    name: "SquadBot",
    role: "LEAD",
    status: "WORKING",
    title: "Squad Lead",
    avatar: "SB",
    color: agentPalette[3], // Orange
  },
  {
    id: "writebot",
    name: "WriteBot",
    role: "INT",
    status: "WORKING",
    title: "Content Writer",
    avatar: "WB",
    color: agentPalette[4], // Violet
  },
  {
    id: "mailbot",
    name: "MailBot",
    role: "INT",
    status: "WORKING",
    title: "Email Marketing",
    avatar: "MB",
    color: agentPalette[5], // Cyan
  },
  {
    id: "socialbot",
    name: "SocialBot",
    role: "INT",
    status: "WORKING",
    title: "Social Media",
    avatar: "SO",
    color: agentPalette[6], // Pink
  },
];


export const tasks: Task[] = [

  {
    id: "t1",
    title: "Audit OpenClaw Agent Memory System",
    description:
      "Map out how agents store and retrieve context across sessions. Document memory architecture and identify bottlenecks...",
    status: "inbox",
    tags: ["research", "documentation"],
    createdAt: "1 day ago",
  },
  {
    id: "t2",
    title: "Design Agent Collaboration Protocol",
    description:
      "Define how Clawd agents hand off tasks to each other. Establish message format, priority rules, and conflict resolution...",
    status: "inbox",
    tags: ["architecture", "strategy"],
    createdAt: "3 hours ago",
  },
  {
    id: "t3",
    title: "Build Agent Performance Metrics Pipeline",
    description:
      "Create a data pipeline to track agent task completion rates, response times, and error rates in real-time...",
    status: "inbox",
    tags: ["data", "infra"],
    createdAt: "3 hours ago",
  },


  {
    id: "t4",
    title: "OpenClaw Product Demo Video Script",
    description:
      "Write the full walkthrough script for the OpenClaw demo video showing multi-agent orchestration in action...",
    status: "assigned",
    assignee: "writebot",
    tags: ["video", "content", "demo"],
    createdAt: "1 day ago",
  },
  {
    id: "t5",
    title: "Launch Thread - Twitter/X Announcement",
    description:
      "Draft a compelling launch thread showcasing Clawd's agent capabilities with real screenshots and demos...",
    status: "assigned",
    assignee: "socialbot",
    tags: ["social", "twitter", "launch"],
    createdAt: "8 hours ago",
  },
  {
    id: "t6",
    title: "Competitor Research - ChatGPT vs Claude",
    description:
      "Deep dive into ChatGPT and Claude capabilities. Pull feature comparisons, pricing, and developer experience notes...",
    status: "assigned",
    assignee: "researchbot",
    tags: ["research", "competitive"],
    createdAt: "8 hours ago",
  },


  {
    id: "t7",
    title: "ChatGPT vs Claude Comparison Page",
    description:
      "Create detailed comparison page breaking down ChatGPT vs Claude for AI agent workflows and orchestration...",
    status: "in_progress",
    assignee: "devbot",
    tags: ["competitor", "seo"],
    createdAt: "1 day ago",
  },
  {
    id: "t8",
    title: "Claude vs ChatGPT for Coding - Deep Dive",
    description:
      "Build out the comparison page focused on coding tasks - benchmarks, agent reliability, and context handling...",
    status: "in_progress",
    assignee: "devbot",
    tags: ["competitor", "seo"],
    createdAt: "2 days ago",
  },
  {
    id: "t9",
    title: "Mission Control Dashboard UI",
    description:
      "Build the real-time agent command center dashboard with React + Next.js for monitoring all Clawd agents...",
    status: "in_progress",
    assignee: "devbot",
    tags: ["frontend", "dashboard"],
    createdAt: "5 hours ago",
  },

  {
    id: "t10",
    title: "OpenClaw Landing Page Copy",
    description:
      "Write conversion-focused copy for the OpenClaw landing page - hero, features, social proof, and CTA sections...",
    status: "review",
    assignee: "writebot",
    tags: ["copy", "landing page"],
    createdAt: "1 day ago",
  },
  {
    id: "t11",
    title: "AI Agent Orchestration - Full Blog Post",
    description:
      "Write full SEO blog post: Why Multi-Agent Orchestration is the Future of AI Automation in 2026...",
    status: "review",
    assignee: "writebot",
    tags: ["seo", "blog"],
    createdAt: "1 day ago",
  },


  {
    id: "t12",
    title: "Developer Onboarding Email Sequence",
    description:
      "Design 5-email drip sequence for new developers: welcome, quickstart, first agent, advanced patterns, community...",
    status: "done",
    assignee: "mailbot",
    tags: ["email", "onboarding"],
    createdAt: "2 days ago",
  },
];



export const feedEntries: FeedEntry[] = [
  {
    id: "f1",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot commented on "Launch Thread - Twitter/X Announcement"',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f2",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot drafted 3 tweet variants for the OpenClaw launch thread',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f3",
    agentId: "socialbot",
    type: "comment",
    content:
      'SocialBot commented on "Launch Thread" - added demo GIF suggestions',
    timestamp: "about 2 hours ago",
  },
  {
    id: "f4",
    agentId: "writebot",
    type: "task",
    content: 'WriteBot completed "OpenClaw Landing Page Copy" first draft',
    timestamp: "about 3 hours ago",
  },
  {
    id: "f5",
    agentId: "researchbot",
    type: "task",
    content: "ResearchBot started competitive analysis on ChatGPT vs Claude",
    timestamp: "about 4 hours ago",
  },
  {
    id: "f6",
    agentId: "devbot",
    type: "status",
    content: "DevBot picked up ChatGPT vs Claude comparison page",
    timestamp: "about 5 hours ago",
  },
  {
    id: "f7",
    agentId: "squadbot",
    type: "task",
    content: "SquadBot assigned 3 new tasks from the inbox",
    timestamp: "about 6 hours ago",
  },
];



export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

/** Column definitions for the kanban board */
export const COLUMN_CONFIG: { key: TaskStatus; label: string }[] = [
  { key: "inbox", label: "INBOX" },
  { key: "assigned", label: "ASSIGNED" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "review", label: "REVIEW" },
  { key: "done", label: "DONE" },
];
