// ── Types ────────────────────────────────────────────────────────────────────

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  agentId: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface CalendarTask {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  time: string;
  days: number[]; // 0=Sun … 6=Sat
}

export interface AlwaysRunningTask {
  id: string;
  name: string;
  interval: string;
  agentId: string;
}

export interface NextUpEntry {
  id: string;
  name: string;
  agentId: string;
  eta: string;
}

// ── Day labels ──────────────────────────────────────────────────────────────

export const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Get tasks for a specific day, sorted by time */
export function getTasksForDay(tasks: CalendarTask[], day: number): CalendarTask[] {
  return tasks
    .filter((t) => t.days.includes(day))
    .sort((a, b) => {
      const toMin = (t: string) => {
        const [time, period] = t.split(" ");
        const [h, m] = time.split(":").map(Number);
        return ((h % 12) + (period === "PM" ? 12 : 0)) * 60 + m;
      };
      return toMin(a.time) - toMin(b.time);
    });
}
