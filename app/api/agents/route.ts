import { NextResponse } from "next/server";
import { execSync } from "node:child_process";
import { readFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

function getAgentStatus(agentId: string): "WORKING" | "IDLE" | "OFFLINE" {
  try {
    const sessionsDir = `/home/openclaw/.openclaw/agents/${agentId}/sessions`;
    const sessionsFile = join(sessionsDir, "sessions.json");
    const data = JSON.parse(readFileSync(sessionsFile, "utf-8"));
    
    let latestUpdate = 0;
    for (const key of Object.keys(data)) {
      const session = data[key];
      if (session.updatedAt && session.updatedAt > latestUpdate) {
        latestUpdate = session.updatedAt;
      }
    }
    
    if (latestUpdate === 0) return "OFFLINE";
    
    const ageMs = Date.now() - latestUpdate;
    if (ageMs < 5 * 60 * 1000) return "WORKING";
    if (ageMs < 30 * 60 * 1000) return "IDLE";
    return "OFFLINE";
  } catch {
    return "OFFLINE";
  }
}

export async function GET() {
  try {
    const output = execSync("openclaw agents list --json", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(output);

    const enriched = agents.map((agent: any, index: number) => ({
      id: agent.id,
      name: agent.identityName || agent.name || agent.id,
      emoji: agent.identityEmoji || "",
      model: agent.model || "unknown",
      workspace: agent.workspace || "",
      agentDir: agent.agentDir || "",
      bindings: agent.bindings || 0,
      isDefault: agent.isDefault || false,
      status: getAgentStatus(agent.id),
      role: agent.isDefault ? "LEAD" : "INT",
      index,
    }));

    return NextResponse.json(enriched);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
