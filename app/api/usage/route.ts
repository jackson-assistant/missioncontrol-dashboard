import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

// GET /api/usage?period=today|week|month&agent=main
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "today";
    const agentFilter = url.searchParams.get("agent");

    const now = Date.now();
    let sinceMs: number;
    switch (period) {
      case "week":
        sinceMs = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        sinceMs = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "today":
      default: {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        sinceMs = d.getTime();
        break;
      }
    }

    // Aggregate stats
    const statsQuery = agentFilter
      ? `SELECT
           COUNT(*) as total_calls,
           COALESCE(SUM(tokens_in + tokens_out), 0) as total_tokens,
           COALESCE(SUM(cost), 0) as total_cost,
           COALESCE(SUM(tokens_in), 0) as tokens_in,
           COALESCE(SUM(tokens_out), 0) as tokens_out
         FROM api_calls WHERE timestamp >= ? AND agent_id = ?`
      : `SELECT
           COUNT(*) as total_calls,
           COALESCE(SUM(tokens_in + tokens_out), 0) as total_tokens,
           COALESCE(SUM(cost), 0) as total_cost,
           COALESCE(SUM(tokens_in), 0) as tokens_in,
           COALESCE(SUM(tokens_out), 0) as tokens_out
         FROM api_calls WHERE timestamp >= ?`;

    const statsParams = agentFilter ? [sinceMs, agentFilter] : [sinceMs];
    const stats: any = db.prepare(statsQuery).get(...statsParams);

    // Per-agent breakdown
    const agentBreakdown = db.prepare(`
      SELECT
        agent_id,
        agent_name,
        COUNT(*) as total_calls,
        COALESCE(SUM(tokens_in + tokens_out), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as total_cost
      FROM api_calls
      WHERE timestamp >= ?
      GROUP BY agent_id
      ORDER BY total_cost DESC
    `).all(sinceMs);

    // Per-model breakdown
    const modelBreakdown = db.prepare(`
      SELECT
        model,
        COUNT(*) as total_calls,
        COALESCE(SUM(tokens_in + tokens_out), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as total_cost
      FROM api_calls
      WHERE timestamp >= ?
      GROUP BY model
      ORDER BY total_cost DESC
    `).all(sinceMs);

    // Recent calls
    const recentCalls = db.prepare(`
      SELECT * FROM api_calls
      WHERE timestamp >= ?
      ORDER BY timestamp DESC
      LIMIT 50
    `).all(sinceMs);

    return NextResponse.json({
      period,
      since: sinceMs,
      stats: {
        totalCalls: stats.total_calls,
        totalTokens: stats.total_tokens,
        totalCost: stats.total_cost,
        tokensIn: stats.tokens_in,
        tokensOut: stats.tokens_out,
      },
      byAgent: agentBreakdown,
      byModel: modelBreakdown,
      recentCalls,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/usage — record a new API call
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();

    const call = {
      id: randomUUID(),
      timestamp: body.timestamp || Date.now(),
      agent_id: body.agent_id || "unknown",
      agent_name: body.agent_name || "",
      model: body.model || "unknown",
      endpoint: body.endpoint || "",
      tokens_in: body.tokens_in || 0,
      tokens_out: body.tokens_out || 0,
      cost: body.cost || 0,
      status: body.status || "success",
      error_message: body.error_message || null,
      session_id: body.session_id || null,
      duration_ms: body.duration_ms || null,
      metadata: JSON.stringify(body.metadata || {}),
    };

    db.prepare(`
      INSERT INTO api_calls (id, timestamp, agent_id, agent_name, model, endpoint, tokens_in, tokens_out, cost, status, error_message, session_id, duration_ms, metadata)
      VALUES (@id, @timestamp, @agent_id, @agent_name, @model, @endpoint, @tokens_in, @tokens_out, @cost, @status, @error_message, @session_id, @duration_ms, @metadata)
    `).run(call);

    return NextResponse.json(call, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
