"use client";

import { todayStats } from "@/lib/api-data";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { BalanceCard } from "@/components/api-usage/balance-card";
import { UsageByAgent } from "@/components/api-usage/usage-by-agent";
import { RecentCallsTable } from "@/components/api-usage/recent-calls-table";
import { Zap, Hash, DollarSign } from "lucide-react";

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
    <div className="flex h-full flex-col gap-4 overflow-auto p-4 md:p-6">
      <PageHeader title="API Usage" description="Monitor balance and API consumption across Clawd agents" />

      {/* Top Row: Balance Card + Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <BalanceCard />
        {statCards.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      <UsageByAgent />
      <RecentCallsTable />
    </div>
  );
}
