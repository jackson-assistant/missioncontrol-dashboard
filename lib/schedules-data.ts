// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Mock Data ───────────────────────────────────────────────────────────────

export const alwaysRunning: AlwaysRunningTask[] = [
  { id: "ar-1", name: "mission control check", interval: "Every 30 min", agentId: "clawdlead" },
  { id: "ar-2", name: "gateway heartbeat", interval: "Every 5 min", agentId: "devbot" },
];

export const calendarTasks: CalendarTask[] = [
  {
    id: "ct-1",
    name: "memory health check",
    agentId: "devbot",
    agentName: "DevBot",
    time: "5:00 AM",
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "ct-2",
    name: "morning brief",
    agentId: "clawdlead",
    agentName: "ClawdLead",
    time: "8:00 AM",
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "ct-3",
    name: "newsletter digest",
    agentId: "mailbot",
    agentName: "MailBot",
    time: "9:00 AM",
    days: [2], // Tuesday only
  },
  {
    id: "ct-4",
    name: "social feed scan",
    agentId: "socialbot",
    agentName: "SocialBot",
    time: "10:00 AM",
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "ct-5",
    name: "research roundup",
    agentId: "researchbot",
    agentName: "ResearchBot",
    time: "2:00 PM",
    days: [1, 3, 5], // Mon, Wed, Fri
  },
  {
    id: "ct-6",
    name: "cost report",
    agentId: "clawdlead",
    agentName: "ClawdLead",
    time: "6:00 PM",
    days: [5], // Friday only
  },
];

export const nextUp: NextUpEntry[] = [
  { id: "nu-1", name: "mission control check", agentId: "clawdlead", eta: "In 12 min" },
  { id: "nu-2", name: "social feed scan", agentId: "socialbot", eta: "In 1 hour" },
  { id: "nu-3", name: "memory health check", agentId: "devbot", eta: "In 18 hours" },
  { id: "nu-4", name: "morning brief", agentId: "clawdlead", eta: "In 19 hours" },
  { id: "nu-5", name: "newsletter digest", agentId: "mailbot", eta: "In 4 days" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Get tasks for a specific day, sorted by time */
export function getTasksForDay(day: number): CalendarTask[] {
  return calendarTasks
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
