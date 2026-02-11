import { agents } from "./data";

// ── Types ──────────────────────────────────────────────────────────────────

export type LogLevel = "info" | "warn" | "error" | "debug" | "success";
export type LogAction =
  | "api_call"
  | "task_start"
  | "task_complete"
  | "task_fail"
  | "tool_use"
  | "message_send"
  | "message_receive"
  | "memory_write"
  | "memory_read"
  | "heartbeat"
  | "gateway"
  | "channel";

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  level: LogLevel;
  action: LogAction;
  summary: string;
  detail: string;
  model?: string;
  tokens?: number;
  latency?: number;
  channel?: string;
}

// ── Action Labels ──────────────────────────────────────────────────────────

export const actionLabels: Record<LogAction, string> = {
  api_call: "API Call",
  task_start: "Task Started",
  task_complete: "Task Complete",
  task_fail: "Task Failed",
  tool_use: "Tool Use",
  message_send: "Message Sent",
  message_receive: "Message Received",
  memory_write: "Memory Write",
  memory_read: "Memory Read",
  heartbeat: "Heartbeat",
  gateway: "Gateway",
  channel: "Channel",
};

export const levelColors: Record<LogLevel, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  error: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  debug: "bg-stone-100 text-stone-500 dark:bg-zinc-700 dark:text-zinc-400",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

// ── Mock Log Entries ───────────────────────────────────────────────────────

function time(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function agentName(id: string): string {
  return agents.find((a) => a.id === id)?.name ?? id;
}

export const logEntries: LogEntry[] = [
  // ─ Very recent activity ─────────────────────────────────────
  {
    id: "log-001",
    timestamp: time(0.2),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "info",
    action: "api_call",
    summary: "Called claude-4-sonnet for code generation",
    detail:
      'Prompt: "Refactor the MissionQueue component to support drag-and-drop reordering." Response: Generated 142 lines of React code with dnd-kit integration. Included TypeScript types and accessibility attributes.',
    model: "claude-4-sonnet",
    tokens: 4280,
    latency: 1842,
  },
  {
    id: "log-002",
    timestamp: time(0.5),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "debug",
    action: "tool_use",
    summary: 'write_file → "components/dashboard/MissionQueue.tsx"',
    detail:
      "Wrote 142 lines to components/dashboard/MissionQueue.tsx. File size: 4.2 KB. Includes imports for @dnd-kit/core, @dnd-kit/sortable, and @dnd-kit/utilities.",
  },
  {
    id: "log-003",
    timestamp: time(0.8),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "info",
    action: "memory_write",
    summary: "Stored task context for Mission Control Dashboard UI",
    detail:
      'Key: devbot:tasks:t9:context. Value: { currentStep: "drag-and-drop", filesModified: ["MissionQueue.tsx"], pendingReview: true }. Namespace size after write: 2.3 MB.',
  },
  {
    id: "log-004",
    timestamp: time(1.2),
    agentId: "socialbot",
    agentName: agentName("socialbot"),
    level: "info",
    action: "api_call",
    summary: "Called claude-4-haiku for tweet draft generation",
    detail:
      'Prompt: "Generate 3 tweet variants for the OpenClaw launch. Focus on multi-agent orchestration, developer tooling, and the open-source angle. Keep it punchy, under 280 chars each." Response: 3 variants generated with hashtags and emoji placement.',
    model: "claude-4-haiku",
    tokens: 1120,
    latency: 680,
  },
  {
    id: "log-005",
    timestamp: time(1.5),
    agentId: "socialbot",
    agentName: agentName("socialbot"),
    level: "success",
    action: "message_send",
    summary: "Posted draft tweets to #launch-content channel",
    detail:
      "Sent 3 tweet variants to the internal review channel. Tagged @WriteBot for copy review. Included engagement predictions: Variant A (est. 2.4% CTR), Variant B (est. 1.8% CTR), Variant C (est. 3.1% CTR).",
    channel: "telegram",
  },
  {
    id: "log-006",
    timestamp: time(2),
    agentId: "clawdlead",
    agentName: agentName("clawdlead"),
    level: "info",
    action: "heartbeat",
    summary: "Heartbeat OK — all systems nominal",
    detail:
      "Gateway: connected. Model endpoint: reachable (latency 45ms). Memory store: online (Redis). Tool permissions: valid. Active sessions: 7/7 agents reporting. Uptime: 14d 6h 34m.",
  },
  {
    id: "log-007",
    timestamp: time(2.5),
    agentId: "researchbot",
    agentName: agentName("researchbot"),
    level: "info",
    action: "api_call",
    summary: "Called gpt-4o for competitive analysis synthesis",
    detail:
      'Prompt: "Synthesize the ChatGPT vs Claude comparison data into a structured report. Include: pricing comparison, context window limits, tool-use capabilities, and agent reliability benchmarks." Response: 2800-token structured report with tables.',
    model: "gpt-4o",
    tokens: 3640,
    latency: 2100,
  },
  {
    id: "log-008",
    timestamp: time(3),
    agentId: "researchbot",
    agentName: agentName("researchbot"),
    level: "debug",
    action: "tool_use",
    summary: "web_search → ChatGPT API pricing 2026",
    detail:
      'Search query: "ChatGPT API pricing February 2026 per token". Results: 12 hits. Top result: OpenAI pricing page (openai.com/pricing). Extracted: GPT-4o at $2.50/1M input, $10/1M output. GPT-4o-mini at $0.15/1M input, $0.60/1M output.',
  },
  {
    id: "log-009",
    timestamp: time(3.5),
    agentId: "researchbot",
    agentName: agentName("researchbot"),
    level: "debug",
    action: "tool_use",
    summary: "web_search → Claude API pricing 2026",
    detail:
      'Search query: "Anthropic Claude API pricing February 2026". Results: 9 hits. Top result: Anthropic pricing page. Extracted: Claude 4 Sonnet at $3/1M input, $15/1M output. Claude 4 Haiku at $0.25/1M input, $1.25/1M output.',
  },
  {
    id: "log-010",
    timestamp: time(4),
    agentId: "writebot",
    agentName: agentName("writebot"),
    level: "info",
    action: "api_call",
    summary: "Called claude-4-sonnet for blog post draft",
    detail:
      'Prompt: "Write an SEO-optimized blog post titled \'Why Multi-Agent Orchestration is the Future of AI Automation in 2026\'. Include sections on: current limitations of single agents, benefits of orchestration, real-world use cases, and getting started with OpenClaw." Response: 3200-token draft with H2/H3 structure.',
    model: "claude-4-sonnet",
    tokens: 5100,
    latency: 3200,
  },
  {
    id: "log-011",
    timestamp: time(4.5),
    agentId: "writebot",
    agentName: agentName("writebot"),
    level: "debug",
    action: "memory_read",
    summary: "Loaded brand voice guidelines from memory",
    detail:
      'Key: writebot:preferences:brand_voice. Retrieved: { tone: "confident but approachable", avoid: ["jargon without explanation", "passive voice"], prefer: ["action verbs", "concrete examples", "developer-first language"] }.',
  },
  {
    id: "log-012",
    timestamp: time(5),
    agentId: "squadbot",
    agentName: agentName("squadbot"),
    level: "success",
    action: "task_complete",
    summary: "Assigned 3 inbox tasks to agents",
    detail:
      'Task routing decisions: t1 "Audit OpenClaw Agent Memory System" → ResearchBot (research specialty match). t2 "Design Agent Collaboration Protocol" → ClawdLead (architecture decision, lead-level). t3 "Build Agent Performance Metrics Pipeline" → DevBot (infra/data tag match).',
  },
  {
    id: "log-013",
    timestamp: time(6),
    agentId: "mailbot",
    agentName: agentName("mailbot"),
    level: "success",
    action: "task_complete",
    summary: 'Completed "Developer Onboarding Email Sequence"',
    detail:
      "Finalized 5-email drip sequence. Email 1: Welcome + quickstart (est. 42% open rate). Email 2: Build your first agent (est. 38% open rate). Email 3: Advanced patterns (est. 31%). Email 4: Community + Discord invite (est. 28%). Email 5: Case studies (est. 25%). Total word count: 4,200.",
  },
  {
    id: "log-014",
    timestamp: time(7),
    agentId: "mailbot",
    agentName: agentName("mailbot"),
    level: "info",
    action: "api_call",
    summary: "Called gpt-4o-mini for subject line A/B variants",
    detail:
      'Prompt: "Generate 3 A/B test subject line variants for a developer onboarding welcome email. The product is OpenClaw, an AI agent orchestration platform." Response: 6 variants (3 pairs) with predicted open rate estimates.',
    model: "gpt-4o-mini",
    tokens: 480,
    latency: 320,
  },
  {
    id: "log-015",
    timestamp: time(8),
    agentId: "clawdlead",
    agentName: agentName("clawdlead"),
    level: "info",
    action: "gateway",
    summary: "Gateway session refresh — 7 active nodes",
    detail:
      "Refreshed gateway session. Active nodes: clawdlead-001, devbot-001, researchbot-001, squadbot-001, writebot-001, mailbot-001, socialbot-001. All nodes healthy. Session TTL reset to 3600s.",
  },
  {
    id: "log-016",
    timestamp: time(9),
    agentId: "socialbot",
    agentName: agentName("socialbot"),
    level: "info",
    action: "channel",
    summary: "Listening on Telegram #openclaw-updates",
    detail:
      "Subscribed to Telegram channel #openclaw-updates for community mentions. Filter: messages containing @openclaw, #openclaw, or openclaw.dev. Polling interval: 30s. Last 24h: 14 matching messages.",
    channel: "telegram",
  },
  {
    id: "log-017",
    timestamp: time(10),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "info",
    action: "task_start",
    summary: 'Started "Mission Control Dashboard UI" (t9)',
    detail:
      'Picked up task t9 from assigned queue. Tags: [frontend, dashboard]. Priority: high. Estimated completion: 4-6 hours. First subtask: scaffold page layout with AgentsPanel, MissionQueue, and LiveFeed components.',
  },
  {
    id: "log-018",
    timestamp: time(12),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "warn",
    action: "api_call",
    summary: "Rate limit warning from claude-4-sonnet (80% of limit)",
    detail:
      "Request to claude-4-sonnet returned rate limit header: X-RateLimit-Remaining: 20/100. Current usage: 80 requests in the last 60s. Threshold alert at 80%. Next request delayed by 2s to avoid hard limit.",
    model: "claude-4-sonnet",
    tokens: 0,
    latency: 45,
  },
  {
    id: "log-019",
    timestamp: time(15),
    agentId: "writebot",
    agentName: agentName("writebot"),
    level: "success",
    action: "task_complete",
    summary: 'Completed first draft of "OpenClaw Landing Page Copy"',
    detail:
      "Landing page sections completed: Hero (tagline + subhead), Features (6 cards), How It Works (3 steps), Social Proof (3 testimonials), CTA (primary + secondary). Total word count: 1,840. Sent to review queue.",
  },
  {
    id: "log-020",
    timestamp: time(18),
    agentId: "researchbot",
    agentName: agentName("researchbot"),
    level: "info",
    action: "task_start",
    summary: 'Started "Competitor Research - ChatGPT vs Claude" (t6)',
    detail:
      'Picked up task t6. Tags: [research, competitive]. Approach: 1) Collect pricing data, 2) Compare context windows and tool-use capabilities, 3) Run benchmark comparisons from published papers, 4) Synthesize into structured report.',
  },
  {
    id: "log-021",
    timestamp: time(20),
    agentId: "clawdlead",
    agentName: agentName("clawdlead"),
    level: "info",
    action: "message_send",
    summary: "Sent daily status digest to admin",
    detail:
      'Daily digest: 7/7 agents active. Tasks completed today: 4. Tasks in progress: 3. Tasks in review: 2. Inbox: 3 pending. No critical errors. Token usage: 12.4M (est. $8.20). Budget remaining: $41.80/$50.00.',
  },
  {
    id: "log-022",
    timestamp: time(25),
    agentId: "socialbot",
    agentName: agentName("socialbot"),
    level: "error",
    action: "api_call",
    summary: "Failed to post to Twitter/X — auth token expired",
    detail:
      'Attempted to post scheduled tweet via Twitter API v2. Response: 401 Unauthorized — "Invalid or expired token". Action: Flagged for admin attention. Retry scheduled after token refresh. Tweet content preserved in memory.',
    model: "twitter-api",
    latency: 230,
  },
  {
    id: "log-023",
    timestamp: time(25.5),
    agentId: "socialbot",
    agentName: agentName("socialbot"),
    level: "warn",
    action: "message_send",
    summary: "Escalated Twitter auth failure to ClawdLead",
    detail:
      'Sent escalation message to ClawdLead: "Twitter/X API token expired. Unable to post launch thread. Need admin to refresh OAuth2 token in .env." Priority: high. Awaiting response.',
  },
  {
    id: "log-024",
    timestamp: time(30),
    agentId: "mailbot",
    agentName: agentName("mailbot"),
    level: "info",
    action: "tool_use",
    summary: "send_email → test onboarding sequence to staging",
    detail:
      'Sent 5-email drip sequence to staging list (3 test addresses). Email provider: Resend. Template IDs: onboard-1 through onboard-5. Scheduled delays: 0h, 24h, 72h, 168h, 336h. All 5 emails queued successfully.',
  },
  {
    id: "log-025",
    timestamp: time(35),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "debug",
    action: "tool_use",
    summary: "git_commit → feat: add agent profile page with tabs",
    detail:
      'Committed 3 files: lib/agent-profile-data.ts (+408 lines), app/agents/[id]/page.tsx (+518 lines), components/dashboard/AgentsPanel.tsx (+15 lines modified). Commit message: "feat: add agent profile page with overview, files, and channels tabs". Branch: main.',
  },
  {
    id: "log-026",
    timestamp: time(40),
    agentId: "squadbot",
    agentName: agentName("squadbot"),
    level: "info",
    action: "message_receive",
    summary: "Received task handoff from WriteBot → review queue",
    detail:
      'WriteBot completed task t10 "OpenClaw Landing Page Copy" and handed off to review queue. SquadBot acknowledged receipt. Review assignment: pending (will route to ClawdLead for approval since it\'s external-facing copy).',
  },
  {
    id: "log-027",
    timestamp: time(45),
    agentId: "clawdlead",
    agentName: agentName("clawdlead"),
    level: "info",
    action: "api_call",
    summary: "Called claude-4-sonnet for task priority analysis",
    detail:
      'Prompt: "Given the current task queue and agent workloads, recommend priority ordering for inbox tasks t1, t2, t3." Response: Recommended order: t2 (architecture, blocks other work) > t3 (metrics pipeline, enables monitoring) > t1 (audit, informational). Reasoning included.',
    model: "claude-4-sonnet",
    tokens: 1850,
    latency: 1200,
  },
  {
    id: "log-028",
    timestamp: time(50),
    agentId: "researchbot",
    agentName: agentName("researchbot"),
    level: "debug",
    action: "memory_write",
    summary: "Stored ChatGPT vs Claude pricing data snapshot",
    detail:
      'Key: researchbot:facts:pricing_comparison_2026_02. Value: { gpt4o: { input: 2.5, output: 10 }, gpt4omini: { input: 0.15, output: 0.6 }, claude4sonnet: { input: 3, output: 15 }, claude4haiku: { input: 0.25, output: 1.25 } }. Units: $/1M tokens.',
  },
  {
    id: "log-029",
    timestamp: time(55),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "error",
    action: "tool_use",
    summary: "run_code failed — TypeScript compilation error",
    detail:
      "Attempted to run generated code. Error: TS2339 Property 'onDragEnd' does not exist on type 'IntrinsicAttributes'. File: components/dashboard/MissionQueue.tsx:45. Fix: Added proper type import from @dnd-kit/core. Re-running...",
  },
  {
    id: "log-030",
    timestamp: time(55.5),
    agentId: "devbot",
    agentName: agentName("devbot"),
    level: "success",
    action: "tool_use",
    summary: "run_code succeeded after fix — TypeScript clean",
    detail:
      "Re-ran TypeScript compilation after adding DragEndEvent import. Result: 0 errors, 0 warnings. Build time: 1.2s. All type checks passing.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export function getUniqueAgents(): string[] {
  return [...new Set(logEntries.map((l) => l.agentId))];
}

export function getUniqueActions(): LogAction[] {
  return [...new Set(logEntries.map((l) => l.action))];
}

export function getUniqueLevels(): LogLevel[] {
  return [...new Set(logEntries.map((l) => l.level))];
}
