import { agents } from "./data";


export interface AgentProfile {
  agentId: string;
  model: string;
  description: string;
  uptime: string;
  tasksCompleted: number;
  tasksFailed: number;
  tokensUsedToday: number;
  lastActive: string;
}

export interface WorkspaceFile {
  name: string;
  path: string;
  content: string;
  size: string;
  lastModified: string;
}

export interface ChannelStatus {
  name: string;
  type: string;
  connected: number;
  total: number;
  configured: number;
  enabled: number;
  groupPolicy: string;
  streamMode: string;
  dmPolicy: string;
}

// ── Agent Profiles ─────────────────────────────────────────────────────────

export const agentProfiles: Record<string, AgentProfile> = {
  clawdlead: {
    agentId: "clawdlead",
    model: "claude-4-sonnet",
    description:
      "Lead orchestrator agent. Manages task delegation, prioritization, and cross-agent coordination for the entire OpenClaw fleet.",
    uptime: "14d 6h 32m",
    tasksCompleted: 247,
    tasksFailed: 3,
    tokensUsedToday: 1_420_000,
    lastActive: "2 minutes ago",
  },
  devbot: {
    agentId: "devbot",
    model: "claude-4-sonnet",
    description:
      "Full-stack development agent. Handles code generation, PR reviews, architecture decisions, and CI/CD pipeline management.",
    uptime: "14d 6h 32m",
    tasksCompleted: 189,
    tasksFailed: 7,
    tokensUsedToday: 2_850_000,
    lastActive: "just now",
  },
  researchbot: {
    agentId: "researchbot",
    model: "gpt-4o",
    description:
      "Deep research specialist. Performs competitive analysis, market research, and synthesizes findings into actionable reports.",
    uptime: "12d 18h 05m",
    tasksCompleted: 94,
    tasksFailed: 2,
    tokensUsedToday: 980_000,
    lastActive: "15 minutes ago",
  },
  squadbot: {
    agentId: "squadbot",
    model: "claude-4-sonnet",
    description:
      "Squad coordination lead. Routes incoming tasks from the inbox, assigns work to agents, and tracks completion across the team.",
    uptime: "14d 6h 32m",
    tasksCompleted: 312,
    tasksFailed: 1,
    tokensUsedToday: 640_000,
    lastActive: "8 minutes ago",
  },
  writebot: {
    agentId: "writebot",
    model: "claude-4-sonnet",
    description:
      "Content creation agent. Writes blog posts, landing page copy, documentation, video scripts, and marketing materials.",
    uptime: "10d 3h 14m",
    tasksCompleted: 156,
    tasksFailed: 4,
    tokensUsedToday: 1_750_000,
    lastActive: "30 minutes ago",
  },
  mailbot: {
    agentId: "mailbot",
    model: "gpt-4o-mini",
    description:
      "Email marketing specialist. Designs drip sequences, writes newsletters, manages subscriber engagement, and A/B tests subject lines.",
    uptime: "9d 12h 48m",
    tasksCompleted: 78,
    tasksFailed: 0,
    tokensUsedToday: 320_000,
    lastActive: "1 hour ago",
  },
  socialbot: {
    agentId: "socialbot",
    model: "claude-4-haiku",
    description:
      "Social media agent. Drafts tweets/threads, manages posting schedules, tracks engagement metrics, and responds to community mentions.",
    uptime: "11d 22h 10m",
    tasksCompleted: 203,
    tasksFailed: 5,
    tokensUsedToday: 540_000,
    lastActive: "5 minutes ago",
  },
};

// ── Workspace Files ────────────────────────────────────────────────────────

const WORKSPACE_BASE = "/home/openclaw/.openclaw/workspace-tweetbot";

function makeFiles(agentId: string): WorkspaceFile[] {
  const agent = agents.find((a) => a.id === agentId);
  const name = agent?.name ?? agentId;

  return [
    {
      name: "agents.md",
      path: `${WORKSPACE_BASE}/agents.md`,
      size: "2.4 KB",
      lastModified: "2 hours ago",
      content: `# Agents Configuration

## ${name}

This file defines the agent roster and their capabilities within the
OpenClaw workspace.

### Registered Agents
- **ClawdLead** — Founder / Lead orchestrator
- **DevBot** — Full-stack developer
- **ResearchBot** — Research specialist
- **SquadBot** — Squad coordinator
- **WriteBot** — Content writer
- **MailBot** — Email marketing
- **SocialBot** — Social media manager

### Inter-Agent Communication
Agents communicate via the Gateway WebSocket RPC channel.
Messages are routed through SquadBot for task delegation.
Direct agent-to-agent messages are permitted for \`review\` handoffs.
`,
    },
    {
      name: "SOUL.md",
      path: `${WORKSPACE_BASE}/SOUL.md`,
      size: "1.8 KB",
      lastModified: "3 days ago",
      content: `# SOUL — ${name}

## Core Personality
You are ${name}, an AI agent within the OpenClaw (Clawd) ecosystem.
You are focused, professional, and collaborative.

## Values
- **Accuracy over speed** — never guess when you can verify
- **Transparency** — always explain your reasoning
- **Collaboration** — defer to specialists when outside your domain
- **Persistence** — retry failed tasks with adjusted strategy

## Communication Style
- Concise and direct
- Use bullet points for structured output
- Cite sources when making factual claims
- Ask clarifying questions before starting ambiguous tasks

## Boundaries
- Never fabricate data or metrics
- Always flag uncertainty explicitly
- Escalate to ClawdLead when blocked for more than 2 attempts
`,
    },
    {
      name: "tools.md",
      path: `${WORKSPACE_BASE}/tools.md`,
      size: "3.1 KB",
      lastModified: "1 day ago",
      content: `# Tools — ${name}

## Available Tools

### Web & Research
- \`web_search\` — Search the web for current information
- \`web_fetch\` — Fetch and parse content from URLs
- \`screenshot\` — Capture a webpage screenshot

### File System
- \`read_file\` — Read file contents from workspace
- \`write_file\` — Write or update files in workspace
- \`list_directory\` — List directory contents

### Code
- \`run_code\` — Execute code in sandboxed environment
- \`git_commit\` — Commit changes to the repository
- \`pr_create\` — Create a pull request

### Communication
- \`send_message\` — Send message to another agent
- \`notify_channel\` — Post to a Telegram/Discord channel
- \`send_email\` — Send email via configured SMTP

### Memory
- \`memory_store\` — Save key-value to persistent memory
- \`memory_recall\` — Retrieve from persistent memory
- \`memory_search\` — Semantic search across memory store
`,
    },
    {
      name: "identity.md",
      path: `${WORKSPACE_BASE}/identity.md`,
      size: "1.2 KB",
      lastModified: "5 days ago",
      content: `# Identity — ${name}

## Agent ID
\`${agentId}\`

## Display Name
${name}

## Role
${agent?.role === "LEAD" ? "Lead Agent" : agent?.role === "SPC" ? "Specialist Agent" : "Integration Agent"}

## Created
2026-01-15T08:00:00Z

## Workspace
${WORKSPACE_BASE}

## Gateway Registration
- Node ID: \`node-${agentId}-001\`
- Session: \`sess-${agentId}-${Math.random().toString(36).slice(2, 8)}\`
- Auth: Token-based (Bearer)

## Model Configuration
- Primary: \`${agentProfiles[agentId]?.model ?? "claude-4-sonnet"}\`
- Fallback: \`gpt-4o-mini\`
- Max tokens per request: 4096
- Temperature: 0.3
`,
    },
    {
      name: "user.md",
      path: `${WORKSPACE_BASE}/user.md`,
      size: "0.9 KB",
      lastModified: "1 week ago",
      content: `# User Context

## Owner
- Name: OpenClaw Admin
- Role: System Administrator
- Timezone: UTC-5 (EST)

## Preferences
- Notification style: Concise summaries
- Escalation threshold: 2 failed attempts
- Review required for: External API calls, email sends, social posts
- Auto-approve: File reads, web searches, internal messages

## Active Projects
- OpenClaw Dashboard (Mission Control)
- Agent orchestration framework
- Content pipeline (blog + social)
- Developer onboarding sequence
`,
    },
    {
      name: "heartbeat.md",
      path: `${WORKSPACE_BASE}/heartbeat.md`,
      size: "0.6 KB",
      lastModified: "30 seconds ago",
      content: `# Heartbeat — ${name}

## Current Status
**${agent?.status ?? "WORKING"}**

## Last Heartbeat
\`2026-02-09T14:32:18Z\`

## Health Check
- Gateway connection: ✅ Connected
- Model endpoint: ✅ Reachable
- Memory store: ✅ Online
- Tool permissions: ✅ Valid

## Resource Usage
- Tokens today: ${(agentProfiles[agentId]?.tokensUsedToday ?? 0).toLocaleString()}
- API calls today: ${Math.floor(Math.random() * 200 + 50)}
- Avg latency: ${Math.floor(Math.random() * 800 + 200)}ms

## Uptime
${agentProfiles[agentId]?.uptime ?? "N/A"}
`,
    },
    {
      name: "bootstrap.md",
      path: `${WORKSPACE_BASE}/bootstrap.md`,
      size: "1.5 KB",
      lastModified: "2 weeks ago",
      content: `# Bootstrap — ${name}

## Startup Sequence

1. **Load identity** — Read identity.md for agent config
2. **Connect gateway** — Establish WebSocket RPC to Gateway
3. **Authenticate** — Present bearer token for session
4. **Load SOUL** — Read SOUL.md for personality and values
5. **Load tools** — Parse tools.md for available capabilities
6. **Load memory** — Hydrate from persistent memory store
7. **Register channels** — Join configured Telegram/Discord channels
8. **Send heartbeat** — Report WORKING status to Gateway
9. **Poll tasks** — Check inbox for assigned work

## Recovery
- On disconnect: Retry with exponential backoff (max 30s)
- On auth failure: Alert ClawdLead, enter IDLE
- On model error: Fall back to gpt-4o-mini, retry once

## Shutdown
- Flush pending memory writes
- Send OFFLINE heartbeat
- Close Gateway session gracefully
`,
    },
    {
      name: "memory.md",
      path: `${WORKSPACE_BASE}/memory.md`,
      size: "2.0 KB",
      lastModified: "10 minutes ago",
      content: `# Memory — ${name}

## Memory Store
Backend: Redis + vector embeddings (pgvector)

## Namespaces
- \`${agentId}:facts\` — verified facts and data points
- \`${agentId}:tasks\` — task context and decisions
- \`${agentId}:conversations\` — summarized conversation history
- \`${agentId}:preferences\` — learned user preferences

## Recent Entries
| Key | Value | Stored |
|-----|-------|--------|
| last_task | ${agent?.title} work | 10m ago |
| model_preference | ${agentProfiles[agentId]?.model ?? "claude-4-sonnet"} | 2h ago |
| retry_count | 0 | 10m ago |
| context_window | 128K tokens | 1d ago |

## Stats
- Total entries: ${Math.floor(Math.random() * 500 + 100)}
- Namespace size: ${(Math.random() * 4 + 0.5).toFixed(1)} MB
- Last garbage collection: 6 hours ago
`,
    },
  ];
}

export const workspaceFiles: Record<string, WorkspaceFile[]> = Object.fromEntries(
  agents.map((a) => [a.id, makeFiles(a.id)])
);

// ── Channel Status ─────────────────────────────────────────────────────────

export const channelStatuses: ChannelStatus[] = [
  {
    name: "Telegram",
    type: "telegram",
    connected: 3,
    total: 3,
    configured: 3,
    enabled: 3,
    groupPolicy: "allowlist",
    streamMode: "partial",
    dmPolicy: "pairing",
  },
  {
    name: "Discord",
    type: "discord",
    connected: 2,
    total: 2,
    configured: 2,
    enabled: 2,
    groupPolicy: "allowlist",
    streamMode: "full",
    dmPolicy: "open",
  },
  {
    name: "Slack",
    type: "slack",
    connected: 0,
    total: 1,
    configured: 1,
    enabled: 0,
    groupPolicy: "none",
    streamMode: "off",
    dmPolicy: "disabled",
  },
];
