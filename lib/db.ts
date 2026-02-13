import Database from "better-sqlite3";
import { join } from "node:path";

const DB_PATH = join(process.cwd(), "missioncontrol.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    migrate(_db);
  }
  return _db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'inbox'
        CHECK(status IN ('inbox', 'assigned', 'in_progress', 'review', 'done')),
      assignee_id TEXT,
      priority TEXT DEFAULT 'normal'
        CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      completed_at INTEGER,
      tags TEXT DEFAULT '[]',
      metadata TEXT DEFAULT '{}'
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);

    CREATE TABLE IF NOT EXISTS api_calls (
      id TEXT PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      agent_id TEXT NOT NULL,
      agent_name TEXT DEFAULT '',
      model TEXT NOT NULL,
      endpoint TEXT DEFAULT '',
      tokens_in INTEGER DEFAULT 0,
      tokens_out INTEGER DEFAULT 0,
      cost REAL DEFAULT 0.0,
      status TEXT DEFAULT 'success'
        CHECK(status IN ('success', 'error')),
      error_message TEXT,
      session_id TEXT,
      duration_ms INTEGER,
      metadata TEXT DEFAULT '{}'
    );

    CREATE INDEX IF NOT EXISTS idx_api_calls_timestamp ON api_calls(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_api_calls_agent ON api_calls(agent_id);
    CREATE INDEX IF NOT EXISTS idx_api_calls_model ON api_calls(model);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}
