import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/tasks/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const task: any = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...task,
      tags: JSON.parse(task.tags || "[]"),
      metadata: JSON.parse(task.metadata || "{}"),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/tasks/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await req.json();
    const now = Date.now();

    const existing: any = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = ["updated_at = ?"];
    const values: any[] = [now];

    const allowedFields = ["title", "description", "status", "assignee_id", "priority"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (body.tags !== undefined) {
      updates.push("tags = ?");
      values.push(JSON.stringify(body.tags));
    }
    if (body.metadata !== undefined) {
      updates.push("metadata = ?");
      values.push(JSON.stringify(body.metadata));
    }

    // Auto-set completed_at when moving to done
    if (body.status === "done" && existing.status !== "done") {
      updates.push("completed_at = ?");
      values.push(now);
    } else if (body.status && body.status !== "done" && existing.status === "done") {
      updates.push("completed_at = ?");
      values.push(null);
    }

    values.push(id);
    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    const updated: any = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    return NextResponse.json({
      ...updated,
      tags: JSON.parse(updated.tags || "[]"),
      metadata: JSON.parse(updated.metadata || "{}"),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/tasks/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
