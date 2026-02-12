import { NextResponse } from "next/server";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
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

    if (!agent || !agent.workspace) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const workspace = agent.workspace;
    const entries = readdirSync(workspace).filter((f: string) => {
      try {
        const s = statSync(join(workspace, f));
        return s.isFile() && f.endsWith(".md");
      } catch {
        return false;
      }
    });

    const files = entries.map((name: string) => {
      const fullPath = join(workspace, name);
      const stat = statSync(fullPath);
      let content = "";
      try {
        content = readFileSync(fullPath, "utf-8");
        if (content.length > 10000) content = content.slice(0, 10000) + "\n\n... (truncated)";
      } catch {}

      const ageMs = Date.now() - stat.mtimeMs;
      let lastModified = "unknown";
      if (ageMs < 60000) lastModified = "just now";
      else if (ageMs < 3600000) lastModified = `${Math.round(ageMs / 60000)} min ago`;
      else if (ageMs < 86400000) lastModified = `${Math.round(ageMs / 3600000)}h ago`;
      else lastModified = `${Math.round(ageMs / 86400000)}d ago`;

      return {
        name,
        path: fullPath,
        content,
        size: stat.size < 1024 ? `${stat.size} B` : `${(stat.size / 1024).toFixed(1)} KB`,
        lastModified,
      };
    });

    return NextResponse.json({ workspace, files });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch files" },
      { status: 500 }
    );
  }
}
