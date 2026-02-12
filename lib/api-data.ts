export interface ApiCallLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  model: string;
  endpoint: string;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  status: "success" | "error";
}

export interface AgentUsage {
  agentId: string;
  agentName: string;
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
}

// Placeholder stats — no live API usage tracking exists yet
export const todayStats = {
  totalCalls: 0,
  tokensUsed: 0,
  estimatedCost: 0,
};

export const agentUsage: AgentUsage[] = [];
export const recentCalls: ApiCallLog[] = [];
