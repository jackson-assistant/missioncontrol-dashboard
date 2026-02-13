import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

/** Strip Telegram/channel prefix from user message to get the raw text */
function extractUserText(content: string): string {
  // Find the LAST channel prefix in the content (handles System: prefix before it)
  const matches = [...content.matchAll(/\[(?:Telegram|Signal|Discord|WhatsApp)[^\]]*\]\s*/g)];
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const afterPrefix = content.slice(lastMatch.index! + lastMatch[0].length);
    return afterPrefix.replace(/\[message_id:\s*\d+\]/g, "").trim();
  }
  // Skip system-only messages
  if (content.startsWith("System:")) return "";
  // Pattern: message_id lines at end
  return content.replace(/\[message_id:\s*\d+\]/g, "").trim();
}

/** Summarize a user message into a short task title (max ~60 chars) */
function summarizeToTitle(text: string): string {
  // Strip markdown, urls, code blocks
  let clean = text
    .replace(/```[\s\S]*?```/g, "[code]")
    .replace(/`[^`]+`/g, "[code]")
    .replace(/https?:\/\/\S+/g, "[link]")
    .replace(/\n+/g, " ")
    .trim();

  // If it's a bullet list, take the first item
  const bulletMatch = clean.match(/^[-•*]\s*(.+?)(?:\n|$)/);
  if (bulletMatch) clean = bulletMatch[1].trim();

  // If it starts with common task verbs, capitalize nicely
  const verbMatch = clean.match(
    /^(can you |please |i want you to |i need you to |go ahead and )/i,
  );
  if (verbMatch) clean = clean.slice(verbMatch[1].length).trim();

  // Capitalize first letter
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  if (clean.length <= 60) return clean;
  // Truncate at word boundary
  const truncated = clean.slice(0, 57).replace(/\s+\S*$/, "");
  return truncated + "...";
}

/** Check if a message is a substantive task (not just casual chat) */
function isSubstantiveTask(text: string): boolean {
  const lower = text.toLowerCase();
  // Skip very short messages, greetings, acknowledgments
  if (text.length < 10) return false;
  const casualPatterns = [
    /^(ok|okay|thanks|thx|ty|cool|nice|great|sure|yes|no|yep|nope|hmm|huh|lol|haha)\b/i,
    /^(good morning|good night|hey|hi|hello|sup|what's up|howdy)\b/i,
    /^(don't worry|never ?mind|nvm|forget it)/i,
    /^(how's the weather|hows the weather)/i,
  ];
  if (casualPatterns.some((p) => p.test(lower))) return false;
  return true;
}

interface SessionTask {
  sessionId: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  userMessage: string;
  messageTimestamp: number;
  lastActivityAt: number;
  isAgentWorking: boolean;
  channel: string;
}

/** Parse a session JSONL file to extract the latest task */
function parseSessionForTask(
  sessionPath: string,
  agentId: string,
  agentName: string,
): SessionTask | null {
  if (!existsSync(sessionPath)) return null;

  try {
    const content = readFileSync(sessionPath, "utf-8");
    const lines = content.trim().split("\n");

    // Get session ID from the first line (always a session entry)
    let sessionId = "";
    try {
      const first = JSON.parse(lines[0]);
      if (first.type === "session") sessionId = first.id;
    } catch {}

    let lastUserMessage = "";
    let lastUserTimestamp = 0;
    let lastActivityAt = 0;
    let lastAssistantHasToolCall = false;
    let channel = "unknown";

    // Parse from the end for efficiency — we only need the latest task
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);

        if (entry.type === "session") {
          sessionId = entry.id;
          continue;
        }

        if (entry.type !== "message") continue;

        const msg = entry.message;
        if (!msg) continue;

        const ts = msg.timestamp || new Date(entry.timestamp).getTime();

        if (msg.role === "user" && !lastUserMessage) {
          const textParts = (msg.content || []).filter(
            (c: any) => c.type === "text",
          );
          if (textParts.length > 0) {
            const rawText = textParts.map((c: any) => c.text).join("\n");
            const userText = extractUserText(rawText);

            // Detect channel from prefix (last occurrence)
            const channelMatches = [...rawText.matchAll(
              /\[(Telegram|Signal|Discord|WhatsApp)/g,
            )];
            if (channelMatches.length > 0) channel = channelMatches[channelMatches.length - 1][1].toLowerCase();

            if (userText && isSubstantiveTask(userText)) {
              lastUserMessage = userText;
              lastUserTimestamp = ts;
            }
          }
        }

        if (msg.role === "assistant" && lastActivityAt === 0) {
          lastActivityAt = ts;
          // Check if the assistant is still working (has pending tool calls)
          const contentArr = msg.content || [];
          lastAssistantHasToolCall = contentArr.some(
            (c: any) => c.type === "toolCall",
          );
        }

        // Once we have both, stop scanning
        if (lastUserMessage && lastActivityAt) break;
      } catch {
        // Skip malformed lines
      }
    }

    if (!lastUserMessage || !sessionId) return null;

    // Only include tasks from last 24h
    const now = Date.now();
    if (now - lastUserTimestamp > 24 * 60 * 60 * 1000) return null;

    const ageMs = now - lastActivityAt;
    const isAgentWorking = ageMs < 3 * 60 * 1000 || lastAssistantHasToolCall;

    return {
      sessionId,
      agentId,
      agentName,
      title: summarizeToTitle(lastUserMessage),
      description: lastUserMessage.length > 60 ? lastUserMessage.slice(0, 200) : "",
      userMessage: lastUserMessage,
      messageTimestamp: lastUserTimestamp,
      lastActivityAt,
      isAgentWorking,
      channel,
    };
  } catch {
    return null;
  }
}

/**
 * POST /api/tasks/sync
 *
 * Scans active agent sessions, parses the JSONL conversation history,
 * and creates/updates tasks in the mission queue based on actual user requests.
 *
 * Flow:
 * - New user message → inbox
 * - Agent actively working (recent tool calls / responses) → in_progress
 * - Agent finished (last response was final, no recent activity) → done
 */
export async function POST() {
  try {
    const db = getDb();
    const now = Date.now();

    const agentsOutput = execSync("openclaw agents list --json", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(agentsOutput);

    let created = 0;
    let updated = 0;

    for (const agent of agents) {
      // Read sessions index
      let sessions: Record<string, any>;
      try {
        const sessionsPath = `/home/openclaw/.openclaw/agents/${agent.id}/sessions/sessions.json`;
        sessions = JSON.parse(readFileSync(sessionsPath, "utf-8"));
      } catch {
        continue;
      }

      for (const [key, session] of Object.entries(sessions)) {
        // Skip cron sessions and sub-agent runs
        if (key.includes(":cron:") || key.includes(":run:")) continue;

        const sessionFile = session.sessionFile;
        if (!sessionFile || !existsSync(sessionFile)) continue;

        const agentName =
          agent.identityName || agent.name || agent.id;

        const task = parseSessionForTask(sessionFile, agent.id, agentName);
        if (!task) continue;

        // Check if we already track this session
        const existing: any = db
          .prepare(
            "SELECT * FROM tasks WHERE json_extract(metadata, '$.sessionId') = ?",
          )
          .get(task.sessionId);

        // Determine status
        // - inbox: task just came in, agent hasn't started yet or is between turns
        // - in_progress: agent is ACTIVELY working right now (last activity < 60s)
        // - done: agent clearly finished (long idle after last response)
        let status: string;
        const ageMs = now - task.lastActivityAt;
        if (task.isAgentWorking && ageMs < 60 * 1000) {
          // Agent actively running RIGHT NOW
          status = "in_progress";
        } else if (ageMs > 10 * 60 * 1000) {
          // No activity for 10+ min — agent finished
          status = "done";
        } else {
          // Default: inbox (just arrived or between turns)
          status = "inbox";
        }

        if (existing) {
          const meta = JSON.parse(existing.metadata || "{}");
          if (!meta.autoManaged) continue; // Don't touch manual tasks

          // Update title if the user sent a new message (different task)
          const titleChanged = existing.title !== task.title;
          const statusChanged = existing.status !== status;

          // Don't resurrect manually completed tasks
          if (existing.status === "done" && existing.completed_at && status !== "done") {
            // Only resurrect if there's actually a NEW user message
            if (!titleChanged) continue;
          }

          if (titleChanged || statusChanged) {
            const updates: string[] = ["updated_at = ?"];
            const values: any[] = [now];

            if (titleChanged) {
              updates.push("title = ?", "description = ?");
              values.push(task.title, task.description);
              // New task from same session → reset to inbox first if was done
              if (existing.status === "done") {
                status = "inbox";
              }
            }

            updates.push("status = ?");
            values.push(status);

            if (status === "done" && existing.status !== "done") {
              updates.push("completed_at = ?");
              values.push(now);
            } else if (status !== "done") {
              updates.push("completed_at = ?");
              values.push(null);
            }

            values.push(existing.id);
            db.prepare(
              `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
            ).run(...values);
            updated++;
          }
        } else {
          db.prepare(`
            INSERT INTO tasks (id, title, description, status, assignee_id, priority, created_at, updated_at, completed_at, tags, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            randomUUID(),
            task.title,
            task.description,
            status,
            agent.id,
            "normal",
            task.messageTimestamp || now,
            now,
            status === "done" ? now : null,
            JSON.stringify([task.channel, "auto"]),
            JSON.stringify({
              sessionId: task.sessionId,
              autoManaged: true,
              agentId: agent.id,
              userMessage: task.userMessage.slice(0, 500),
            }),
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
