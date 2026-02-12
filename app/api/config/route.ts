import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get agent defaults (model, imageModel, aliases)
    const defaultsOutput = execSync("openclaw config get agents.defaults 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const defaults = JSON.parse(defaultsOutput);

    // Get agents list
    const agentsOutput = execSync("openclaw agents list --json 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(agentsOutput);

    return NextResponse.json({
      defaults,
      agents: agents.map((a: any) => ({
        id: a.id,
        name: a.identityName || a.name || a.id,
        model: a.model,
        isDefault: a.isDefault,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch config" },
      { status: 500 }
    );
  }
}
