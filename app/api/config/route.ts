import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get model config
    const modelOutput = execSync("openclaw config get model 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const modelConfig = JSON.parse(modelOutput);

    // Get agents list
    const agentsOutput = execSync("openclaw agents list --json 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(agentsOutput);

    // Get channels
    let channels: any = {};
    try {
      const channelsOutput = execSync("openclaw config get channels 2>/dev/null", {
        encoding: "utf-8",
        timeout: 10000,
      });
      channels = JSON.parse(channelsOutput);
    } catch {}

    return NextResponse.json({
      models: modelConfig,
      agents: agents.map((a: any) => ({
        id: a.id,
        name: a.identityName || a.name || a.id,
        model: a.model,
        isDefault: a.isDefault,
      })),
      channels,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch config" },
      { status: 500 }
    );
  }
}
