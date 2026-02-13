/**
 * Lightweight cron expression utilities for display purposes.
 * Supports standard 5-field cron: minute hour day-of-month month day-of-week
 */

export interface ParsedCron {
  /** Minutes (0-59) the job runs, or null for "every" */
  minutes: number[] | null;
  /** Hours (0-23) the job runs, or null for "every" */
  hours: number[] | null;
  /** Days of month (1-31), or null for "every" */
  daysOfMonth: number[] | null;
  /** Months (1-12), or null for "every" */
  months: number[] | null;
  /** Days of week (0-6, 0=Sun), or null for "every" */
  daysOfWeek: number[] | null;
}

/** Parse a single cron field into an array of values or null (wildcard) */
function parseField(field: string, min: number, max: number): number[] | null {
  if (field === "*") return null;

  const values = new Set<number>();

  for (const part of field.split(",")) {
    // Step: */n or range/n
    const stepMatch = part.match(/^(\*|\d+-\d+)\/(\d+)$/);
    if (stepMatch) {
      const step = parseInt(stepMatch[2]);
      let start = min;
      let end = max;
      if (stepMatch[1] !== "*") {
        const [s, e] = stepMatch[1].split("-").map(Number);
        start = s;
        end = e;
      }
      for (let i = start; i <= end; i += step) values.add(i);
      continue;
    }

    // Range: n-m
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      for (let i = start; i <= end; i++) values.add(i);
      continue;
    }

    // Single value
    const num = parseInt(part);
    if (!isNaN(num)) values.add(num);
  }

  return values.size > 0 ? Array.from(values).sort((a, b) => a - b) : null;
}

/** Parse a 5-field cron expression */
export function parseCron(expr: string): ParsedCron | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  return {
    minutes: parseField(parts[0], 0, 59),
    hours: parseField(parts[1], 0, 23),
    daysOfMonth: parseField(parts[2], 1, 31),
    months: parseField(parts[3], 1, 12),
    daysOfWeek: parseField(parts[4], 0, 6),
  };
}

/** Check if a cron job runs on a given day of week (0=Sun) */
export function runsOnDay(parsed: ParsedCron, day: number): boolean {
  // If both day-of-month and day-of-week are wildcards, runs every day
  if (parsed.daysOfWeek === null && parsed.daysOfMonth === null) return true;
  // If day-of-week is specified, check it
  if (parsed.daysOfWeek !== null) return parsed.daysOfWeek.includes(day);
  // If only day-of-month is specified, it could run any day (we show on all days)
  return true;
}

/** Format a time from hours/minutes arrays. Returns e.g. "8:00 AM" */
export function formatCronTime(parsed: ParsedCron): string {
  const hour = parsed.hours?.[0] ?? 0;
  const minute = parsed.minutes?.[0] ?? 0;
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? "PM" : "AM";
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

/** Get all run times for display (when there are multiple) */
export function formatAllCronTimes(parsed: ParsedCron): string[] {
  const hours = parsed.hours || [0];
  const minutes = parsed.minutes || [0];
  const times: string[] = [];

  for (const hour of hours) {
    for (const minute of minutes) {
      const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      times.push(`${h12}:${minute.toString().padStart(2, "0")} ${period}`);
    }
  }

  return times;
}

/** Human-readable summary of a cron schedule */
export function describeCron(expr: string, tz?: string): string {
  const parsed = parseCron(expr);
  if (!parsed) return expr;

  const time = formatCronTime(parsed);
  const tzLabel = tz ? ` (${tz.split("/").pop()})` : "";

  // Every day
  if (parsed.daysOfWeek === null && parsed.daysOfMonth === null) {
    return `Daily at ${time}${tzLabel}`;
  }

  // Specific days of week
  if (parsed.daysOfWeek !== null) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (parsed.daysOfWeek.length === 5 &&
        parsed.daysOfWeek.every((d) => d >= 1 && d <= 5)) {
      return `Weekdays at ${time}${tzLabel}`;
    }
    if (parsed.daysOfWeek.length === 2 &&
        parsed.daysOfWeek.includes(0) && parsed.daysOfWeek.includes(6)) {
      return `Weekends at ${time}${tzLabel}`;
    }
    const days = parsed.daysOfWeek.map((d) => dayNames[d]).join(", ");
    return `${days} at ${time}${tzLabel}`;
  }

  return `${time}${tzLabel}`;
}
