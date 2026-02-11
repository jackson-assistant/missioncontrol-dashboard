export interface ApiCallLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  model: string;
  endpoint: string;
  tokensIn: number;
  tokensOut: number;
  cost: number; // USD
  latency: number; // ms
  status: "success" | "error";
}

export interface AgentUsage {
  agentId: string;
  agentName: string;
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
}

export const todayStats = {
  totalCalls: 847,
  tokensUsed: 1_243_560,
  estimatedCost: 3.72,
};

export const agentUsage: AgentUsage[] = [
  { agentId: "devbot", agentName: "DevBot", totalCalls: 234, totalTokens: 456_200, totalCost: 1.37 },
  { agentId: "writebot", agentName: "WriteBot", totalCalls: 189, totalTokens: 312_400, totalCost: 0.94 },
  { agentId: "researchbot", agentName: "ResearchBot", totalCalls: 156, totalTokens: 234_100, totalCost: 0.70 },
  { agentId: "socialbot", agentName: "SocialBot", totalCalls: 98, totalTokens: 89_300, totalCost: 0.27 },
  { agentId: "squadbot", agentName: "SquadBot", totalCalls: 87, totalTokens: 78_200, totalCost: 0.23 },
  { agentId: "mailbot", agentName: "MailBot", totalCalls: 52, totalTokens: 45_600, totalCost: 0.14 },
  { agentId: "clawdlead", agentName: "ClawdLead", totalCalls: 31, totalTokens: 27_760, totalCost: 0.07 },
];

export const recentCalls: ApiCallLog[] = [
  {
    id: "log-1",
    timestamp: "2 min ago",
    agentId: "devbot",
    agentName: "DevBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 2340,
    tokensOut: 1890,
    cost: 0.012,
    latency: 1240,
    status: "success",
  },
  {
    id: "log-2",
    timestamp: "4 min ago",
    agentId: "writebot",
    agentName: "WriteBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 1560,
    tokensOut: 3200,
    cost: 0.014,
    latency: 2100,
    status: "success",
  },
  {
    id: "log-3",
    timestamp: "5 min ago",
    agentId: "researchbot",
    agentName: "ResearchBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 4200,
    tokensOut: 890,
    cost: 0.015,
    latency: 980,
    status: "success",
  },
  {
    id: "log-4",
    timestamp: "8 min ago",
    agentId: "socialbot",
    agentName: "SocialBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 890,
    tokensOut: 1200,
    cost: 0.006,
    latency: 870,
    status: "success",
  },
  {
    id: "log-5",
    timestamp: "10 min ago",
    agentId: "devbot",
    agentName: "DevBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 3100,
    tokensOut: 2400,
    cost: 0.016,
    latency: 1890,
    status: "error",
  },
  {
    id: "log-6",
    timestamp: "12 min ago",
    agentId: "squadbot",
    agentName: "SquadBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 1200,
    tokensOut: 560,
    cost: 0.005,
    latency: 450,
    status: "success",
  },
  {
    id: "log-7",
    timestamp: "15 min ago",
    agentId: "writebot",
    agentName: "WriteBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 2800,
    tokensOut: 4100,
    cost: 0.020,
    latency: 2890,
    status: "success",
  },
  {
    id: "log-8",
    timestamp: "18 min ago",
    agentId: "researchbot",
    agentName: "ResearchBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 5600,
    tokensOut: 1200,
    cost: 0.020,
    latency: 1340,
    status: "success",
  },
  {
    id: "log-9",
    timestamp: "22 min ago",
    agentId: "mailbot",
    agentName: "MailBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 980,
    tokensOut: 1800,
    cost: 0.008,
    latency: 1120,
    status: "success",
  },
  {
    id: "log-10",
    timestamp: "25 min ago",
    agentId: "clawdlead",
    agentName: "ClawdLead",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 670,
    tokensOut: 340,
    cost: 0.003,
    latency: 320,
    status: "success",
  },
  {
    id: "log-11",
    timestamp: "30 min ago",
    agentId: "devbot",
    agentName: "DevBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 1890,
    tokensOut: 2100,
    cost: 0.012,
    latency: 1560,
    status: "success",
  },
  {
    id: "log-12",
    timestamp: "35 min ago",
    agentId: "socialbot",
    agentName: "SocialBot",
    model: "kimi-k2.5",
    endpoint: "/v1/chat/completions",
    tokensIn: 1100,
    tokensOut: 1500,
    cost: 0.008,
    latency: 940,
    status: "error",
  },
];
