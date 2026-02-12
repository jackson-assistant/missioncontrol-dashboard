// Types only — data now comes from API routes

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
  connected: boolean;
  configured: boolean;
  running: boolean;
  probe?: {
    ok: boolean;
    elapsedMs: number;
    bot?: { id: number; username: string };
  };
}
