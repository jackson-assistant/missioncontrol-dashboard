import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const output = execSync("openclaw logs --json --limit 100 2>/dev/null", {
      encoding: "utf-8",
      timeout: 10000,
    });

    // Parse JSONL format - each line is a JSON object
    const lines = output.trim().split("\n").filter(Boolean);
    const entries: any[] = [];

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.type === "log") {
          entries.push({
            time: parsed.time,
            level: parsed.level,
            message: parsed.message,
            subsystem: parsed.subsystem || null,
          });
        }
      } catch {}
    }

    return NextResponse.json({ entries });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
