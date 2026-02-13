"use client";

import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { BalanceCard } from "@/components/api-usage/balance-card";
import { UsageByAgent } from "@/components/api-usage/usage-by-agent";
import { RecentCallsTable } from "@/components/api-usage/recent-calls-table";
import { useUsage } from "@/lib/hooks";
import { Zap, Hash, DollarSign } from "lucide-react";
import { useState } from "react";

export default function ApiUsagePage() {
  const [period, setPeriod] = useState("today");
  const { usage, isLoading } = useUsage(period);

  const stats = usage?.stats || { totalCalls: 0, totalTokens: 0, totalCost: 0 };

  const statCards = [
    { label: "Calls", value: stats.totalCalls.toLocaleString(), icon: Zap, color: "text-blue-500" },
    {
      label: "Tokens Used",
      value: stats.totalTokens >= 1_000_000
        ? `${(stats.totalTokens / 1_000_000).toFixed(1)}M`
        : stats.totalTokens >= 1_000
          ? `${(stats.totalTokens / 1_000).toFixed(0)}K`
          : String(stats.totalTokens),
      icon: Hash,
      color: "text-amber-500",
    },
    { label: "Est. Cost", value: `$${stats.totalCost.toFixed(2)}`, icon: DollarSign, color: "text-violet-500" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4 md:p-6">
      <div className="flex items-center justify-between">
        <PageHeader title="API Usage" description="Monitor balance and API consumption across agents" />
        <div className="flex overflow-hidden rounded-lg border">
          {["today", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                period === p
                  ? "bg-foreground text-background"
                  : "text-dim hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <BalanceCard />
        {statCards.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={isLoading ? "..." : s.value} color={s.color} />
        ))}
      </div>

      <UsageByAgent byAgent={usage?.byAgent || []} isLoading={isLoading} />
      <RecentCallsTable calls={usage?.recentCalls || []} isLoading={isLoading} />
    </div>
  );
}
