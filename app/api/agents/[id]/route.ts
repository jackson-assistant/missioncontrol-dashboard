import { NextResponse } from "next/server";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const output = execSync("openclaw agents list --json", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(output);
    const agent = agents.find((a: any) => a.id === id);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Read session data for status
    let status: "WORKING" | "IDLE" | "OFFLINE" = "OFFLINE";
    let lastActive = "unknown";
    try {
      const sessionsFile = join(
        `/home/openclaw/.openclaw/agents/${id}/sessions`,
        "sessions.json"
      );
      const data = JSON.parse(readFileSync(sessionsFile, "utf-8"));
      let latestUpdate = 0;
      for (const key of Object.keys(data)) {
        if (data[key].updatedAt > latestUpdate) {
          latestUpdate = data[key].updatedAt;
        }
      }
      if (latestUpdate > 0) {
        const ageMs = Date.now() - latestUpdate;
        if (ageMs < 5 * 60 * 1000) { status = "WORKING"; lastActive = "just now"; }
        else if (ageMs < 30 * 60 * 1000) { status = "IDLE"; lastActive = `${Math.round(ageMs / 60000)} min ago`; }
        else if (ageMs < 3600 * 1000) { lastActive = `${Math.round(ageMs / 60000)} min ago`; }
        else { lastActive = `${Math.round(ageMs / 3600000)}h ago`; }
      }
    } catch {}

    return NextResponse.json({
      id: agent.id,
      name: agent.identityName || agent.name || agent.id,
      emoji: agent.identityEmoji || "",
      model: agent.model || "unknown",
      workspace: agent.workspace || "",
      agentDir: agent.agentDir || "",
      bindings: agent.bindings || 0,
      isDefault: agent.isDefault || false,
      status,
      lastActive,
      role: agent.isDefault ? "LEAD" : "INT",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch agent" },
      { status: 500 }
    );
  }
}
