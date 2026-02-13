import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

/**
 * POST /api/tasks/sync
 *
 * Scans active agent sessions and auto-creates/updates tasks in the mission queue.
 * A "task" = an active session where a user sent a message to an agent.
 *
 * Logic:
 * - Each non-cron session becomes a task (keyed by session ID)
 * - Session with recent activity (< 5 min) → in_progress
 * - Session idle (5-30 min) → review (agent may be done)
 * - Session very old (> 30 min idle) → done
 * - New sessions not yet tracked → inbox
 */
export async function POST() {
  try {
    const db = getDb();
    const now = Date.now();

    // Get all agents
    const agentsOutput = execSync("openclaw agents list --json", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(agentsOutput);

    let created = 0;
    let updated = 0;

    for (const agent of agents) {
      // Read sessions file
      let sessions: Record<string, any>;
      try {
        const sessionsPath = `/home/openclaw/.openclaw/agents/${agent.id}/sessions/sessions.json`;
        sessions = JSON.parse(readFileSync(sessionsPath, "utf-8"));
      } catch {
        continue;
      }

      for (const [key, session] of Object.entries(sessions)) {
        // Skip cron sessions and sub-agent sessions
        if (key.includes(":cron:") || key.includes(":run:")) continue;

        const sessionId = session.sessionId;
        if (!sessionId) continue;

        const updatedAt = session.updatedAt || 0;
        const ageMs = now - updatedAt;

        // Derive task title from session context
        const origin = session.origin || {};
        const label = origin.label || key;
        const channel = origin.provider || session.lastChannel || "unknown";
        const agentName = agent.identityName || agent.name || agent.id;

        // Check if task already exists for this session
        const existing: any = db
          .prepare("SELECT * FROM tasks WHERE json_extract(metadata, '$.sessionId') = ?")
          .get(sessionId);

        // Determine status based on session age
        let status: string;
        if (ageMs < 5 * 60 * 1000) {
          status = "in_progress";
        } else if (ageMs < 30 * 60 * 1000) {
          status = "review";
        } else {
          status = "done";
        }

        if (existing) {
          // Don't downgrade manually moved tasks
          // Only auto-update if the task was auto-created (has sessionId metadata)
          // and hasn't been manually edited (check metadata.autoManaged)
          const meta = JSON.parse(existing.metadata || "{}");
          if (meta.autoManaged) {
            // Don't resurrect done tasks that were manually marked done
            if (existing.status === "done" && status !== "done" && existing.completed_at) {
              continue;
            }
            if (existing.status !== status) {
              db.prepare("UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?").run(
                status,
                now,
                existing.id,
              );
              if (status === "done" && existing.status !== "done") {
                db.prepare("UPDATE tasks SET completed_at = ? WHERE id = ?").run(now, existing.id);
              }
              updated++;
            }
          }
        } else {
          // Only create tasks for sessions that had activity in the last 24h
          if (ageMs > 24 * 60 * 60 * 1000) continue;

          const title = `${agentName}: ${label}`;
          db.prepare(`
            INSERT INTO tasks (id, title, description, status, assignee_id, priority, created_at, updated_at, completed_at, tags, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            randomUUID(),
            title,
            `Auto-tracked session via ${channel}`,
            status,
            agent.id,
            "normal",
            updatedAt || now,
            now,
            status === "done" ? now : null,
            JSON.stringify([channel, "auto"]),
            JSON.stringify({ sessionId, autoManaged: true, agentId: agent.id }),
          );
          created++;
        }
      }
    }

    return NextResponse.json({ synced: true, created, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
