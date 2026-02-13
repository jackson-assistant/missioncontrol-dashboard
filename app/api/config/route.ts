import { NextResponse } from "next/server";
import { execSync } from "node:child_process";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// Default settings
const defaultSettings = {
  timezone: "Australia/Sydney",
  dateFormat: "DD/MM/YYYY",
  autoRefreshInterval: 30,
  lowBalanceThreshold: 10,
  agentOfflineTimeout: 15,
};

function getSettings(db: any) {
  try {
    const rows = db.prepare("SELECT key, value FROM settings").all();
    const settings: Record<string, any> = { ...defaultSettings };
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return settings;
  } catch {
    return defaultSettings;
  }
}

export async function GET() {
  try {
    const db = getDb();

    // Get user settings from database
    const userSettings = getSettings(db);

    // Get agent defaults (model, imageModel, aliases) from OpenClaw
    const defaultsOutput = execSync("openclaw config get agents.defaults 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const defaults = JSON.parse(defaultsOutput);

    // Get agents list from OpenClaw
    const agentsOutput = execSync("openclaw agents list --json 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });
    const agents = JSON.parse(agentsOutput);

    return NextResponse.json({
      settings: userSettings,
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

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const now = Date.now();

    // Update settings in database
    for (const [key, value] of Object.entries(body)) {
      // Skip keys that should not be stored (agents, models, API keys)
      if (["agents", "models", "apiKey", "api_keys"].includes(key)) continue;

      db.prepare(
        "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)"
      ).run(key, JSON.stringify(value), now);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}
