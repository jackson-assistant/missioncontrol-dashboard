"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { agents, tasks } from "@/lib/data";
import {
  agentProfiles,
  workspaceFiles,
  channelStatuses,
  type WorkspaceFile,
  type ChannelStatus,
} from "@/lib/agent-profile-data";
import { AgentsPanel } from "@/components/dashboard/AgentsPanel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Radio,
  ArrowLeft,
  Zap,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// ── Role / Status Styles ───────────────────────────────────────────────────

const roleStyles: Record<string, string> = {
  LEAD: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  INT: "border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-400",
  SPC: "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400",
};

const statusColors: Record<string, string> = {
  WORKING: "bg-emerald-500",
  IDLE: "bg-amber-500",
  OFFLINE: "bg-stone-400 dark:bg-zinc-600",
};

const statusText: Record<string, string> = {
  WORKING: "text-emerald-600 dark:text-emerald-400",
  IDLE: "text-amber-600 dark:text-amber-400",
  OFFLINE: "text-stone-500 dark:text-zinc-500",
};


function OverviewTab({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const profile = agentProfiles[agentId];
  const agentTasks = tasks.filter((t) => t.assignee === agentId);
  const completedTasks = agentTasks.filter((t) => t.status === "done");
  const activeTasks = agentTasks.filter(
    (t) => t.status === "in_progress" || t.status === "assigned"
  );

  if (!agent || !profile) return null;

  const stats = [
    {
      label: "Primary Model",
      value: profile.model,
      icon: Cpu,
      color: "text-violet-500",
    },
    {
      label: "Uptime",
      value: profile.uptime,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Tasks Completed",
      value: profile.tasksCompleted.toString(),
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Tasks Failed",
      value: profile.tasksFailed.toString(),
      icon: XCircle,
      color: "text-rose-500",
    },
    {
      label: "Tokens Today",
      value:
        profile.tokensUsedToday >= 1_000_000
          ? `${(profile.tokensUsedToday / 1_000_000).toFixed(1)}M`
          : `${(profile.tokensUsedToday / 1_000).toFixed(0)}K`,
      icon: Zap,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-dashed border-stone-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 dark:bg-zinc-700 ${stat.color}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="mt-3 text-lg font-bold text-stone-800 dark:text-zinc-100">
                {stat.label === "Primary Model" ? (
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs dark:bg-zinc-700">
                    {stat.value}
                  </code>
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="text-sm font-bold text-stone-800 dark:text-zinc-100">
          About
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
          {profile.description}
        </p>
      </div>

      {/* Active Tasks */}
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="text-sm font-bold text-stone-800 dark:text-zinc-100">
          Current Tasks
        </h3>
        <p className="text-xs text-stone-400 dark:text-zinc-500">
          {activeTasks.length} active, {completedTasks.length} completed
        </p>
        {activeTasks.length > 0 ? (
          <div className="mt-3 space-y-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-dashed border-stone-200 px-3 py-2.5 dark:border-zinc-700"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    task.status === "in_progress"
                      ? "animate-pulse bg-blue-500"
                      : "bg-stone-400 dark:bg-zinc-600"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-stone-700 dark:text-zinc-300">
                    {task.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                    {task.status.replace("_", " ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-stone-200 px-1.5 py-0 text-[9px] text-stone-400 dark:border-zinc-700 dark:text-zinc-500"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs italic text-stone-400 dark:text-zinc-500">
            No active tasks
          </p>
        )}
      </div>
    </div>
  );
}

// ── Files Tab ──────────────────────────────────────────────────────────────

function FilesTab({ agentId }: { agentId: string }) {
  const files = workspaceFiles[agentId] ?? [];
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(
    files[0] ?? null
  );

  return (
    <div className="flex h-[calc(100vh-280px)] overflow-hidden rounded-xl border border-dashed border-stone-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      {/* File List Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-dashed border-stone-200 dark:border-zinc-700">
        <div className="border-b border-dashed border-stone-200 px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            Workspace Files
          </p>
          <p className="mt-0.5 truncate text-[10px] text-stone-400 dark:text-zinc-600">
            /home/openclaw/.openclaw/workspace-tweetbot/
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-52px)]">
          <div className="p-1.5">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  selectedFile?.name === file.name
                    ? "bg-stone-100 dark:bg-zinc-700"
                    : "hover:bg-stone-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-medium ${
                      selectedFile?.name === file.name
                        ? "text-stone-800 dark:text-zinc-100"
                        : "text-stone-600 dark:text-zinc-400"
                    }`}
                  >
                    {file.name}
                  </p>
                  <p className="text-[10px] text-stone-400 dark:text-zinc-500">
                    {file.size} &middot; {file.lastModified}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* File Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-dashed border-stone-200 px-4 py-2.5 dark:border-zinc-700">
              <div>
                <p className="text-xs font-bold text-stone-800 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-stone-400 dark:text-zinc-500">
                  {selectedFile.path}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 dark:text-zinc-500">
                <span>{selectedFile.size}</span>
                <span>&middot;</span>
                <span>Modified {selectedFile.lastModified}</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-4 font-mono text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                {selectedFile.content}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-stone-400 dark:text-zinc-500">
            Select a file to view
          </div>
        )}
      </div>
    </div>
  );
}

// ── Channels Tab ───────────────────────────────────────────────────────────

function ChannelCard({ channel }: { channel: ChannelStatus }) {
  const allConnected = channel.connected === channel.total;

  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/80">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-800 dark:text-zinc-100">
            {channel.name}
          </h4>
          <p className="text-xs text-stone-400 dark:text-zinc-500">
            {channel.type}
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-xs text-stone-600 dark:text-zinc-300">
            <span
              className={`font-bold ${allConnected ? "text-emerald-500" : "text-amber-500"}`}
            >
              {channel.connected}/{channel.total}
            </span>{" "}
            connected
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            {channel.configured} configured
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            {channel.enabled} enabled
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            groupPolicy: {channel.groupPolicy}
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            streamMode: {channel.streamMode}
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            dmPolicy: {channel.dmPolicy}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChannelsTab() {
  const [lastRefresh, setLastRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastRefresh(0);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Simulate elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-800 dark:text-zinc-100">
              Channels
            </h3>
            <p className="text-xs text-stone-400 dark:text-zinc-500">
              Gateway-wide channel status snapshot.
            </p>
            <p className="mt-1 text-[11px] text-stone-400 dark:text-zinc-500">
              Last refresh: {lastRefresh}s ago
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          >
            <RefreshCw
              className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {channelStatuses.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;

  const agent = agents.find((a) => a.id === agentId);
  const profile = agentProfiles[agentId];

  if (!agent || !profile) {
    return (
      <div className="flex h-full overflow-hidden">
        <AgentsPanel />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-sm text-stone-500 dark:text-zinc-400">
            Agent not found
          </p>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <AgentsPanel />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Back link */}
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 transition-colors hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <ArrowLeft className="h-3 w-3" />
              Dashboard
            </Link>

            {/* Agent Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback
                  style={{ backgroundColor: agent.color, color: "white" }}
                  className="text-lg font-bold"
                >
                  {agent.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-stone-800 dark:text-zinc-100">
                    {agent.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`border px-2 py-0.5 text-[10px] ${roleStyles[agent.role]}`}
                  >
                    {agent.role}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`}
                    />
                    <span
                      className={`text-xs font-medium uppercase ${statusText[agent.status]}`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-sm text-stone-500 dark:text-zinc-400">
                  {agent.title}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-stone-400 dark:text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    <code className="rounded bg-stone-100 px-1 py-0.5 text-[10px] dark:bg-zinc-700">
                      {profile.model}
                    </code>
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Uptime {profile.uptime}
                  </span>
                  <span>&middot;</span>
                  <span>Last active {profile.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList variant="line">
                <TabsTrigger value="overview" className="gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="channels" className="gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  Channels
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <OverviewTab agentId={agentId} />
              </TabsContent>

              <TabsContent value="files" className="mt-4">
                <FilesTab agentId={agentId} />
              </TabsContent>

              <TabsContent value="channels" className="mt-4">
                <ChannelsTab />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
