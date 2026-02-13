// ── Types ──────────────────────────────────────────────────────────────────

export type LogLevel = "success" | "warn" | "error" | "debug" | "info";
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
  | "channel"
  | "system";

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
  system: "System",
};

export const levelColors: Record<string, string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  error: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  debug: "bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

/** Infer a meaningful action from the raw log message */
function inferAction(msg: string, subsystem: string): LogAction {
  const m = msg.toLowerCase();
  if (m.includes("heartbeat")) return "heartbeat";
  if (m.includes("message") && (m.includes("received") || m.includes("incoming"))) return "message_receive";
  if (m.includes("message") && (m.includes("sent") || m.includes("deliver"))) return "message_send";
  if (m.includes("tool") || m.includes("exec")) return "tool_use";
  if (m.includes("memory") && m.includes("write")) return "memory_write";
  if (m.includes("memory") && m.includes("read")) return "memory_read";
  if (m.includes("task") && m.includes("start")) return "task_start";
  if (m.includes("task") && (m.includes("complete") || m.includes("done"))) return "task_complete";
  if (m.includes("task") && m.includes("fail")) return "task_fail";
  if (m.includes("api") || m.includes("model") || m.includes("token")) return "api_call";
  if (m.includes("channel") || m.includes("telegram") || m.includes("webhook")) return "channel";
  if (m.includes("gateway") || subsystem === "gateway") return "gateway";
  return "system";
}

/** Map raw gateway log to our LogEntry */
export function mapGatewayLog(raw: any, index: number): LogEntry {
  const level =
    raw.level === "error"
      ? "error"
      : raw.level === "warn"
        ? "warn"
        : raw.level === "debug"
          ? "debug"
          : "info";

  const time = raw.time
    ? new Date(raw.time).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  const subsystem = raw.subsystem || "system";
  const message = raw.message || "";
  const action = inferAction(message, subsystem);

  // Create a cleaner summary — strip noise prefixes
  let summary = message.slice(0, 200);
  // Remove JSON subsystem prefix like {"subsystem":"plugins"}
  summary = summary.replace(/^\{[^}]*\}\s*/, "");

  return {
    id: `log-${index}`,
    timestamp: time,
    agentId: subsystem,
    agentName: subsystem === "system" ? "System" : subsystem,
    level: level as LogLevel,
    action,
    summary,
    detail: message,
  };
}
