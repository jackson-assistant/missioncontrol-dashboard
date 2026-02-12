import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";

let cache: { data: any; ts: number } | null = null;
const TTL = 10000; // 10s

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const output = execSync("openclaw channels status --probe --json 2>/dev/null", {
      encoding: "utf-8",
      timeout: 20000,
    });
    const data = JSON.parse(output);
    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
