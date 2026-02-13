import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const output = execSync("openclaw health --json", {
      encoding: "utf-8",
      timeout: 15000,
    });
    return NextResponse.json(JSON.parse(output));
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch health" },
      { status: 500 }
    );
  }
}
