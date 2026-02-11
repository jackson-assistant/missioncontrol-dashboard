// ── Types ────────────────────────────────────────────────────────────────────

export interface AppSettings {
  general: {
    dashboardName: string;
    timezone: string;
    autoRefreshInterval: number;
    dateFormat: string;
  };
  apiKeys: {
    moonshotApiKey: string;
    gatewayToken: string;
  };
  gateway: {
    url: string;
    authMode: "token" | "password";
    connectionTimeout: number;
    autoReconnect: boolean;
    maxRetries: number;
  };
  models: {
    defaultModel: string;
    fallbackModel: string;
    maxTokensPerRequest: number;
    temperature: number;
  };
  notifications: {
    lowBalanceThreshold: number;
    errorRateAlert: number;
    agentOfflineTimeout: number;
    emailNotifications: boolean;
    channels: {
      email: boolean;
      slack: boolean;
      telegram: boolean;
      webhook: boolean;
    };
  };
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const defaultSettings: AppSettings = {
  general: {
    dashboardName: "Mission Control",
    timezone: "UTC",
    autoRefreshInterval: 30,
    dateFormat: "MM/DD/YYYY",
  },
  apiKeys: {
    moonshotApiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    gatewayToken: "gw-xxxxxxxxxxxxxxxxxxxxxxxx",
  },
  gateway: {
    url: "ws://localhost:18789",
    authMode: "token",
    connectionTimeout: 10000,
    autoReconnect: true,
    maxRetries: 3,
  },
  models: {
    defaultModel: "kimi-k2.5",
    fallbackModel: "claude-sonnet-4-20250514",
    maxTokensPerRequest: 4096,
    temperature: 0.7,
  },
  notifications: {
    lowBalanceThreshold: 10,
    errorRateAlert: 5,
    agentOfflineTimeout: 15,
    emailNotifications: true,
    channels: {
      email: true,
      slack: false,
      telegram: true,
      webhook: false,
    },
  },
};

// ── Option lists ─────────────────────────────────────────────────────────────

export const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
];

export const dateFormats = [
  "MM/DD/YYYY",
  "DD/MM/YYYY",
  "YYYY-MM-DD",
  "DD MMM YYYY",
];

export const availableModels = [
  "kimi-k2.5",
  "claude-sonnet-4-20250514",
  "claude-3.5-sonnet",
  "gpt-4o",
  "gpt-4o-mini",
  "gemini-2.0-flash",
  "deepseek-v3",
  "llama-3.3-70b",
];

export const refreshIntervals = [
  { value: 0, label: "Off" },
  { value: 10, label: "10 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 300, label: "5 minutes" },
];
