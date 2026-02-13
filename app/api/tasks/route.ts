import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

// GET /api/tasks?status=inbox,assigned&assignee=main&limit=100
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get("status");
    const assignee = url.searchParams.get("assignee");
    const limit = Math.min(Number(url.searchParams.get("limit") || 200), 1000);

    let query = "SELECT * FROM tasks";
    const conditions: string[] = [];
    const params: any[] = [];

    if (statusFilter) {
      const statuses = statusFilter.split(",").map((s) => s.trim());
      conditions.push(`status IN (${statuses.map(() => "?").join(",")})`);
      params.push(...statuses);
    }

    if (assignee) {
      conditions.push("assignee_id = ?");
      params.push(assignee);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);

    const tasks = db.prepare(query).all(...params);

    // Parse JSON fields
    const parsed = tasks.map((t: any) => ({
      ...t,
      tags: JSON.parse(t.tags || "[]"),
      metadata: JSON.parse(t.metadata || "{}"),
    }));

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const now = Date.now();

    const task = {
      id: randomUUID(),
      title: body.title || "Untitled Task",
      description: body.description || "",
      status: body.status || "inbox",
      assignee_id: body.assignee_id || null,
      priority: body.priority || "normal",
      created_at: now,
      updated_at: now,
      completed_at: null,
      tags: JSON.stringify(body.tags || []),
      metadata: JSON.stringify(body.metadata || {}),
    };

    db.prepare(`
      INSERT INTO tasks (id, title, description, status, assignee_id, priority, created_at, updated_at, completed_at, tags, metadata)
      VALUES (@id, @title, @description, @status, @assignee_id, @priority, @created_at, @updated_at, @completed_at, @tags, @metadata)
    `).run(task);

    return NextResponse.json({
      ...task,
      tags: JSON.parse(task.tags),
      metadata: JSON.parse(task.metadata),
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
