# Mission Control Dashboard - Data Source Analysis

## Overview
This document maps each dashboard page/feature to its data requirements and identifies what can be read directly from OpenClaw Gateway vs what needs SQLite storage.

---

## 📊 Data Available from OpenClaw Gateway (Live)

### Via CLI Commands (already implemented)
1. **`openclaw agents list --json`**
   - Agent ID, name, emoji, model, workspace, bindings, isDefault, status
   - Returns: Array of agent configs
   
2. **`openclaw cron list --json`**
   - Cron jobs: id, name, schedule, enabled, state.nextRunAtMs
   - Returns: {jobs: [...]}

3. **`openclaw logs --json --limit 100`**
   - Log entries: time, level, message, subsystem
   - Returns: JSONL format (line-by-line JSON objects)

4. **`openclaw config get agents.defaults`**
   - Default model, imageModel, model aliases
   - Returns: JSON config object

5. **`openclaw health --json`**
   - Channel status, agent sessions, heartbeat config
   - Returns: Comprehensive health object

### Via File System (direct reads)
1. **Sessions metadata**: `/home/openclaw/.openclaw/agents/{agentId}/sessions/sessions.json`
   - Session keys, updatedAt timestamps, delivery context, chat type
   - Agent status derived from last session update time

2. **Session transcripts**: `/home/openclaw/.openclaw/agents/{agentId}/sessions/{sessionId}.jsonl`
   - Full conversation history (JSONL format)
   - Tool calls, messages, model switches

3. **Agent workspace files**: Can list/read files in agent workspaces

### Via External APIs
1. **Moonshot Balance**: `https://api.moonshot.ai/v1/users/me/balance`
   - Account balance, credit info
   - Requires MOONSHOT_API_KEY

---

## 🗂️ Data That Needs SQLite Storage

### ❌ **NOT Available from OpenClaw** (requires custom tracking):

1. **Task/Mission Queue** (`MissionQueue` component)
   - Tasks with: id, title, description, status (inbox/assigned/in_progress/review/done)
   - Assignee, tags, createdAt, updatedAt
   - **No built-in task tracking in OpenClaw**
   - **Must be stored in SQLite**

2. **API Usage Tracking** (`api-usage/page.tsx`)
   - Per-call logs: timestamp, agentId, model, endpoint, tokensIn, tokensOut, cost, status
   - Aggregated stats: daily totals, per-agent usage, recent calls
   - **OpenClaw doesn't track API usage/costs**
   - **Must be stored in SQLite** (capture from logs or instrument gateway)

3. **Completed Tasks History**
   - Archive of done/closed tasks
   - **Must be stored in SQLite**

4. **Historical Session Metrics**
   - Session duration, message counts, tool usage over time
   - **Must be stored in SQLite** (derive from parsing session JSONL files)

5. **Live Feed Activity Classification**
   - Currently done client-side from logs
   - Could cache classified activity events in SQLite for historical view

---

## 📄 Page-by-Page Breakdown

### 1. **Home (`app/page.tsx`)**
Components:
- `AgentsPanel` → **✅ Live from Gateway** (agents list, sessions metadata)
- `MissionQueue` → **❌ Needs SQLite** (task tracking)
- `LiveFeed` → **✅ Live from Gateway** (logs API)

### 2. **Schedules (`app/schedules/page.tsx`)**
Components:
- `AlwaysRunningSection` → **✅ Live from Gateway** (static UI + health check)
- `WeeklyCalendar` / `TodayView` → **✅ Live from Gateway** (cron jobs)
- `NextUpSection` → **✅ Live from Gateway** (cron jobs + state.nextRunAtMs)

**No SQLite needed** (unless you want historical cron run logs beyond what's in filesystem)

### 3. **API Usage (`app/api-usage/page.tsx`)**
Components:
- `BalanceCard` → **✅ Live from External API** (Moonshot balance)
- `StatCard` (calls, tokens, cost) → **❌ Needs SQLite** (usage tracking)
- `UsageByAgent` → **❌ Needs SQLite** (aggregated per-agent stats)
- `RecentCallsTable` → **❌ Needs SQLite** (call logs with token/cost)

**SQLite Tables Needed:**
```sql
CREATE TABLE api_calls (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  agent_id TEXT NOT NULL,
  model TEXT NOT NULL,
  endpoint TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost REAL,
  status TEXT CHECK(status IN ('success', 'error'))
);

CREATE INDEX idx_calls_timestamp ON api_calls(timestamp);
CREATE INDEX idx_calls_agent ON api_calls(agent_id);
```

### 4. **Logs (`app/logs/page.tsx`)**
- `LogRow` / `DetailPanel` → **✅ Live from Gateway** (logs API)
- `StatsBar` → **✅ Live from Gateway** (derived client-side)

**No SQLite needed** (logs already persistent in gateway log files)

### 5. **Agent Profile (`app/agents/[id]/page.tsx`)**
Tabs:
- `OverviewTab` → **✅ Live from Gateway** (agent details, sessions)
- `FilesTab` → **✅ Live from Gateway** (workspace file listing)
- `ChannelsTab` → **✅ Live from Gateway** (channels API)

**No SQLite needed** (all live data)

### 6. **Settings (`app/settings/page.tsx`)**
- Configuration display → **✅ Live from Gateway** (config API)
- Local preferences (timezone, refresh, thresholds) → **⚠️ Optional SQLite**
  - Could store in browser localStorage instead
  - Or persist in SQLite for multi-device sync

---

## 🎯 SQLite Schema Recommendation

### Core Tables

#### 1. **Tasks** (Mission Queue)
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK(status IN ('inbox', 'assigned', 'in_progress', 'review', 'done')),
  assignee_id TEXT, -- agent ID
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER,
  tags TEXT, -- JSON array
  metadata TEXT -- JSON for extensibility
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_created ON tasks(created_at);
```

#### 2. **API Calls** (Usage Tracking)
```sql
CREATE TABLE api_calls (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  model TEXT NOT NULL,
  endpoint TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost REAL DEFAULT 0.0,
  status TEXT CHECK(status IN ('success', 'error')),
  error_message TEXT,
  session_id TEXT,
  metadata TEXT -- JSON for additional fields
);

CREATE INDEX idx_api_calls_timestamp ON api_calls(timestamp);
CREATE INDEX idx_api_calls_agent ON api_calls(agent_id);
CREATE INDEX idx_api_calls_model ON api_calls(model);
CREATE INDEX idx_api_calls_session ON api_calls(session_id);
```

#### 3. **Settings** (Optional - can use localStorage)
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## 🔄 Data Collection Strategy

### For API Usage Tracking
**Option 1: Gateway Log Parsing** (Passive)
- Parse `openclaw logs --json` output
- Extract model call events (look for patterns like "Agent turn", "Model: ...", token counts)
- Insert into `api_calls` table
- **Pros**: No gateway modification needed
- **Cons**: May miss data if log format changes, requires heuristics

**Option 2: Gateway Instrumentation** (Active)
- Hook into OpenClaw's model invocation layer
- Log every API call with exact token/cost data
- **Pros**: Precise, reliable data
- **Cons**: Requires modifying/extending gateway code

**Option 3: Proxy Wrapper** (External)
- Intercept API requests via proxy
- Log request/response metadata
- **Pros**: No gateway changes, portable
- **Cons**: Complex setup, may not capture all calls

**Recommendation**: Start with Option 1 (log parsing) as a proof-of-concept, then evaluate if more precision is needed.

### For Task Management
**Manual Entry** (Initial Approach)
- Provide UI to create/update/move tasks
- Store in SQLite immediately
- **Later**: Could auto-create tasks from agent messages ("Added task: ...") via parsing

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Live Data Only)
✅ Already done:
- Agents panel (live)
- Schedules (live cron)
- Logs (live logs)
- Agent profiles (live)
- Settings (live config)

### Phase 2: SQLite + Task Tracking
1. Set up SQLite database
2. Create `tasks` table
3. Build task CRUD API routes
4. Implement Mission Queue drag-and-drop
5. Add task creation UI

### Phase 3: API Usage Tracking
1. Create `api_calls` table
2. Implement log parser job
3. Build API routes for usage stats
4. Wire up API Usage page components
5. Add real-time tracking (optional)

### Phase 4: Historical Analytics
1. Session history parsing
2. Time-series aggregations
3. Charts for trends
4. Cost projections

---

## 📝 Summary Table

| Feature | Data Source | Storage Needed |
|---------|-------------|----------------|
| Agent List | OpenClaw CLI | None (live) |
| Agent Status | Sessions metadata | None (live) |
| Cron Jobs | OpenClaw CLI | None (live) |
| Logs | OpenClaw CLI | None (live, already on disk) |
| Config | OpenClaw CLI | None (live) |
| Balance | Moonshot API | None (live) |
| **Tasks/Mission Queue** | **None** | **SQLite required** |
| **API Usage Stats** | **None** | **SQLite required** |
| **Completed Tasks** | **None** | **SQLite required** |
| Local Settings | Browser/Config | Optional (localStorage or SQLite) |

---

## 🔍 Next Steps

1. **Set up SQLite**
   - Create DB file: `missioncontrol.db`
   - Initialize schema (tasks + api_calls tables)
   - Add migration system (optional: use Prisma or raw SQL)

2. **Build Task API**
   - `POST /api/tasks` - Create task
   - `GET /api/tasks` - List tasks (with filters)
   - `PATCH /api/tasks/:id` - Update task (status, assignee, etc.)
   - `DELETE /api/tasks/:id` - Delete task

3. **Wire Up Mission Queue**
   - Fetch tasks from `/api/tasks`
   - Implement drag-and-drop status changes
   - Add task creation form

4. **Implement Usage Tracking**
   - Build log parser (background job or on-demand)
   - Create `/api/usage` endpoints
   - Connect to API Usage page

5. **Add Charts & Visualizations**
   - Time-series graphs for usage
   - Cost breakdown by agent/model
   - Task completion velocity

---

## 💡 Key Insights

- **~70% of the dashboard can run entirely on live Gateway data** (agents, schedules, logs, config)
- **~30% requires custom storage** (tasks, usage tracking, historical analytics)
- **OpenClaw provides excellent CLI/API access** for real-time monitoring
- **The missing piece is task/work management and cost tracking** → perfect use case for SQLite
- **Log parsing is feasible** for usage tracking but may need refinement based on log format stability

---

**Generated**: 2026-02-13  
**Author**: CodingBot
