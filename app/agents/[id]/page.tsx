"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Panel } from "@/components/dashboard/ui/panel";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { StatusDot } from "@/components/dashboard/ui/status-dot";
import { RoleBadge } from "@/components/dashboard/ui/role-badge";
import { CodeBadge } from "@/components/dashboard/ui/code-badge";
import { EmptyState } from "@/components/dashboard/ui/empty-state";
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

// ── Overview Tab ───────────────────────────────────────────────────────────

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
    { label: "Primary Model", value: <CodeBadge className="text-xs">{profile.model}</CodeBadge>, icon: Cpu, color: "text-violet-500" },
    { label: "Uptime", value: profile.uptime, icon: Clock, color: "text-blue-500" },
    { label: "Tasks Completed", value: profile.tasksCompleted.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Tasks Failed", value: profile.tasksFailed.toString(), icon: XCircle, color: "text-rose-500" },
    {
      label: "Tokens Today",
      value: profile.tokensUsedToday >= 1_000_000
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
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={<span className="text-lg">{stat.value}</span>}
            color={stat.color}
          />
        ))}
      </div>

      {/* Description */}
      <Panel>
        <h3 className="text-sm font-bold text-foreground">
          About
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-dim">
          {profile.description}
        </p>
      </Panel>

      {/* Active Tasks */}
      <Panel>
        <h3 className="text-sm font-bold text-foreground">
          Current Tasks
        </h3>
        <p className="text-xs text-muted-foreground">
          {activeTasks.length} active, {completedTasks.length} completed
        </p>
        {activeTasks.length > 0 ? (
          <div className="mt-3 space-y-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    task.status === "in_progress"
                      ? "animate-pulse bg-blue-500"
                      : "bg-stone-400 dark:bg-zinc-600"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-subtle">
                    {task.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {task.status.replace("_", " ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-1.5 py-0 text-[9px] text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs italic text-muted-foreground">
            No active tasks
          </p>
        )}
      </Panel>
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
    <Panel padding="none" className="flex h-[calc(100vh-280px)] overflow-hidden">
      {/* File List Sidebar */}
      <div className="w-[220px] shrink-0 border-r border-dashed">
        <div className="border-b border-dashed px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workspace Files
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            /home/openclaw/.openclaw/workspace-tweetbot/
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-52px)]">
          <div className="p-1.5">
            {files.map((file) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-muted"
                      : "hover:bg-stone-50 dark:hover:bg-zinc-700/50"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-medium ${
                        isSelected
                          ? "text-foreground"
                          : "text-dim"
                      }`}
                    >
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.size} &middot; {file.lastModified}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* File Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-dashed px-4 py-2.5">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedFile.path}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{selectedFile.size}</span>
                <span>&middot;</span>
                <span>Modified {selectedFile.lastModified}</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-4 font-mono text-xs leading-relaxed text-subtle">
                {selectedFile.content}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <EmptyState message="Select a file to view" className="flex-1" />
        )}
      </div>
    </Panel>
  );
}

// ── Channels Tab ───────────────────────────────────────────────────────────

function ChannelCard({ channel }: { channel: ChannelStatus }) {
  const allConnected = channel.connected === channel.total;

  return (
    <Panel className="bg-stone-50 dark:bg-zinc-800/80">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground">
            {channel.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {channel.type}
          </p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-xs text-subtle">
            <span className={`font-bold ${allConnected ? "text-emerald-500" : "text-amber-500"}`}>
              {channel.connected}/{channel.total}
            </span>{" "}
            connected
          </p>
          <p className="text-xs text-dim">
            {channel.configured} configured
          </p>
          <p className="text-xs text-dim">
            {channel.enabled} enabled
          </p>
          <p className="text-xs text-dim">
            groupPolicy: {channel.groupPolicy}
          </p>
          <p className="text-xs text-dim">
            streamMode: {channel.streamMode}
          </p>
          <p className="text-xs text-dim">
            dmPolicy: {channel.dmPolicy}
          </p>
        </div>
      </div>
    </Panel>
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

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <Panel padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Channels
            </h3>
            <p className="text-xs text-muted-foreground">
              Gateway-wide channel status snapshot.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Last refresh: {lastRefresh}s ago
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {channelStatuses.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>
      </Panel>
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
          <EmptyState message="Agent not found" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-dim hover:text-foreground"
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

      <div className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Back link */}
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-subtle"
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
                  <h1 className="text-xl font-bold text-foreground">
                    {agent.name}
                  </h1>
                  <RoleBadge role={agent.role} className="px-2 py-0.5" />
                  <StatusDot status={agent.status} label />
                </div>
                <p className="mt-0.5 text-sm text-dim">
                  {agent.title}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    <CodeBadge>{profile.model}</CodeBadge>
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
