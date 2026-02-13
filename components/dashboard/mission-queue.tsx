"use client";

import { useState, useEffect } from "react";
import { COLUMN_CONFIG } from "@/lib/data";
import type { TaskStatus } from "@/lib/data";
import { useTasks, useAgents } from "@/lib/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Inbox, Plus, X, GripVertical, Trash2, ChevronRight, RefreshCw } from "lucide-react";

const columnDotColors: Record<TaskStatus, string> = {
  inbox: "bg-amber-400",
  in_progress: "bg-violet-400",
  review: "bg-orange-400",
  done: "bg-emerald-400",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  normal: "bg-stone-500/10 text-stone-500",
  low: "bg-stone-500/5 text-stone-400",
};

interface TaskCardProps {
  task: any;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const currentIdx = COLUMN_CONFIG.findIndex((c) => c.key === task.status);

  return (
    <div className="group rounded-lg border bg-card p-2.5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-start gap-1 text-left"
          >
            <span className="text-xs font-medium leading-snug text-foreground">
              {task.title}
            </span>
          </button>

          {expanded && task.description && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {task.priority && task.priority !== "normal" && (
              <span className={`rounded-full px-1.5 py-0 text-[9px] font-semibold uppercase ${priorityColors[task.priority] || priorityColors.normal}`}>
                {task.priority}
              </span>
            )}
            {task.tags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-blue-500/10 px-1.5 py-0 text-[9px] font-medium text-blue-600 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {currentIdx < COLUMN_CONFIG.length - 1 && (
            <button
              onClick={() => onStatusChange(task.id, COLUMN_CONFIG[currentIdx + 1].key)}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title={`Move to ${COLUMN_CONFIG[currentIdx + 1].label}`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-0.5 text-muted-foreground hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTaskForm({
  status,
  onSubmit,
  onCancel,
}: {
  status: TaskStatus;
  onSubmit: (title: string, description: string, priority: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), priority);
    setTitle("");
    setDescription("");
    setPriority("normal");
  };

  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-2.5">
      <input
        autoFocus
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="w-full rounded-md border bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1.5 w-full rounded-md border bg-card px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring resize-none"
        rows={2}
      />
      <div className="mt-1.5 flex items-center justify-between">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-md border bg-card px-2 py-1 text-[10px] font-medium text-subtle outline-none"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex gap-1.5">
          <button
            onClick={onCancel}
            className="rounded-md px-2 py-1 text-[10px] font-medium text-dim hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-md bg-foreground px-2.5 py-1 text-[10px] font-medium text-background disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function MissionQueue() {
  const { tasks, mutate } = useTasks();
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/tasks/sync", { method: "POST" });
      mutate();
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync on mount
  useEffect(() => {
    fetch("/api/tasks/sync", { method: "POST" }).then(() => mutate());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tasksByStatus = COLUMN_CONFIG.reduce(
    (acc, col) => {
      acc[col.key] = tasks.filter((t: any) => t.status === col.key);
      return acc;
    },
    {} as Record<TaskStatus, any[]>,
  );

  const handleAddTask = async (
    status: TaskStatus,
    title: string,
    description: string,
    priority: string,
  ) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, priority }),
    });
    setAddingTo(null);
    mutate();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-dashed px-4 py-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-subtle">Mission Queue</span>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-dim transition-colors hover:bg-muted hover:text-foreground"
          title="Sync tasks from active sessions"
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
          Sync
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {COLUMN_CONFIG.map((col) => {
          const colTasks = tasksByStatus[col.key] || [];
          return (
            <div
              key={col.key}
              className="flex min-w-0 flex-1 flex-col border-r border-dashed last:border-r-0"
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 border-b border-dashed px-3 py-2.5">
                <span className={`h-2 w-2 rounded-full ${columnDotColors[col.key]}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-subtle">
                  {col.label}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto flex h-5 min-w-[20px] items-center justify-center bg-secondary/70 p-0 text-[10px] text-dim"
                >
                  {colTasks.length}
                </Badge>
                <button
                  onClick={() => setAddingTo(addingTo === col.key ? null : col.key)}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {addingTo === col.key ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Cards */}
              <ScrollArea className="flex-1">
                <div className="space-y-2 p-2">
                  {addingTo === col.key && (
                    <AddTaskForm
                      status={col.key}
                      onSubmit={(title, desc, priority) =>
                        handleAddTask(col.key, title, desc, priority)
                      }
                      onCancel={() => setAddingTo(null)}
                    />
                  )}

                  {colTasks.length > 0
                    ? colTasks.map((task: any) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))
                    : addingTo !== col.key && (
                        <EmptyState
                          icon={col.key === "inbox" ? Inbox : undefined}
                          message={col.key === "inbox" ? "No tasks yet" : "Empty"}
                          hint={
                            col.key === "inbox"
                              ? "Click + to add a task"
                              : undefined
                          }
                          className="py-8"
                        />
                      )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </section>
  );
}
