"use client";

import { useEffect, useState, useCallback } from "react";
import { todayStats, agentUsage, recentCalls } from "@/lib/api-data";
import { getAgentColor } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Panel } from "@/components/dashboard/ui/panel";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { CodeBadge } from "@/components/dashboard/ui/code-badge";
import {
  Wallet,
  Zap,
  Hash,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface BalanceData {
  available_balance: number;
  voucher_balance: number;
  cash_balance: number;
}

function BalanceCard() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/balance");
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch balance");
        return;
      }

      if (json.data) {
        setBalance(json.data);
      } else {
        setError("Unexpected response format");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const balancePercent = balance
    ? Math.min(100, Math.max(0, (balance.available_balance / 50) * 100))
    : 0;

  const isLow = balance ? balance.available_balance < 10 : false;

  return (
    <Panel padding="lg" className="col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-emerald-500">
            <Wallet className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Moonshot Balance
            </p>
            <p className="text-xs text-dim">
              Kimi K2.5
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={fetchBalance}
          disabled={loading}
        >
          <RefreshCw
            className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
          {error}
          {error.includes("not configured") && (
            <p className="mt-1 text-[10px] opacity-70">
              Add MOONSHOT_API_KEY to your .env.local file
            </p>
          )}
        </div>
      ) : loading && !balance ? (
        <div className="mt-4 space-y-2">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
        </div>
      ) : balance ? (
        <>
          <div className="mt-4 flex items-baseline gap-1">
            <span
              className={`text-3xl font-bold ${isLow ? "text-rose-500" : "text-foreground"}`}
            >
              ${balance.available_balance.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              USD
            </span>
            {isLow && (
              <Badge className="ml-2 bg-rose-100 text-[10px] text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                Low Balance
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                isLow ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ width: `${balancePercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[11px]">
            <div>
              <span className="text-muted-foreground">
                Voucher:{" "}
              </span>
              <span className="font-medium text-subtle">
                ${balance.voucher_balance.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Cash: </span>
              <span className="font-medium text-subtle">
                ${balance.cash_balance.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      ) : null}
    </Panel>
  );
}

// ── Table Header Cell ──────────────────────────────────────────────────────

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground ${className ?? ""}`}>
      {children}
    </th>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ApiUsagePage() {
  const statCards = [
    { label: "Calls Today", value: todayStats.totalCalls.toLocaleString(), icon: Zap, color: "text-blue-500" },
    {
      label: "Tokens Used",
      value: todayStats.tokensUsed >= 1_000_000
        ? `${(todayStats.tokensUsed / 1_000_000).toFixed(1)}M`
        : `${(todayStats.tokensUsed / 1_000).toFixed(0)}K`,
      icon: Hash,
      color: "text-amber-500",
    },
    { label: "Est. Daily Cost", value: `$${todayStats.estimatedCost.toFixed(2)}`, icon: DollarSign, color: "text-violet-500" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-6">
      <PageHeader title="API Usage" description="Monitor balance and API consumption across Clawd agents" />

      {/* Top Row: Balance Card + Stats */}
      <div className="grid grid-cols-5 gap-4">
        <BalanceCard />
        {statCards.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      {/* Usage by Agent */}
      <Panel>
        <h2 className="text-sm font-bold text-foreground">
          Usage by Agent
        </h2>
        <p className="text-xs text-muted-foreground">
          Today&apos;s API consumption per agent
        </p>
        <div className="mt-4 grid grid-cols-7 gap-3">
          {agentUsage.map((agent) => (
            <div key={agent.agentId} className="text-center">
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: getAgentColor(agent.agentId) }}
              >
                {agent.agentName.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-1.5 text-xs font-medium text-subtle">
                {agent.agentName}
              </p>
              <p className="font-mono text-[11px] font-bold text-foreground">
                {agent.totalCalls}
              </p>
              <p className="text-[10px] text-muted-foreground">
                ${agent.totalCost.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Recent Call Log */}
      <Panel padding="none" className="flex-1 overflow-hidden">
        <div className="border-b border-dashed px-4 py-3">
          <h2 className="text-sm font-bold text-foreground">
            Recent API Calls
          </h2>
          <p className="text-xs text-muted-foreground">
            Last {recentCalls.length} calls across all agents
          </p>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dashed text-left">
                <Th>Time</Th>
                <Th>Agent</Th>
                <Th>Model</Th>
                <Th className="text-right">Tokens In</Th>
                <Th className="text-right">Tokens Out</Th>
                <Th className="text-right">Cost</Th>
                <Th className="text-right">Latency</Th>
                <Th className="text-center">Status</Th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-dashed border-stone-100 transition-colors hover:bg-stone-50 dark:border-zinc-700/50 dark:hover:bg-zinc-700/30"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {call.timestamp}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-subtle">
                    {call.agentName}
                  </td>
                  <td className="px-4 py-3">
                    <CodeBadge>{call.model}</CodeBadge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-dim">
                    {call.tokensIn.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-dim">
                    {call.tokensOut.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-medium text-stone-800 dark:text-zinc-200">
                    ${call.cost.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-dim">
                    {call.latency}ms
                  </td>
                  <td className="px-4 py-3 text-center">
                    {call.status === "success" ? (
                      <CheckCircle className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mx-auto h-4 w-4 text-rose-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Panel>
    </div>
  );
}
