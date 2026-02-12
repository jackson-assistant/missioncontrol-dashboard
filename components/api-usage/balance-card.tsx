"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { Wallet, RefreshCw } from "lucide-react";

interface BalanceData {
  available_balance: number;
  voucher_balance: number;
  cash_balance: number;
}

export function BalanceCard() {
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
    <Panel padding="lg" className="sm:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-emerald-500">
            <Wallet className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Moonshot Balance
            </p>
            <p className="text-xs text-dim">Kimi K2.5</p>
          </div>
        </div>
        <Button variant="ghost" size="xs" onClick={fetchBalance} disabled={loading}>
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
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
            <span className={`text-3xl font-bold ${isLow ? "text-rose-500" : "text-foreground"}`}>
              ${balance.available_balance.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">USD</span>
            {isLow && (
              <Badge className="ml-2 bg-rose-100 text-[10px] text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                Low Balance
              </Badge>
            )}
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${isLow ? "bg-rose-500" : "bg-emerald-500"}`}
              style={{ width: `${balancePercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[11px]">
            <div>
              <span className="text-muted-foreground">Voucher: </span>
              <span className="font-medium text-subtle">${balance.voucher_balance.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cash: </span>
              <span className="font-medium text-subtle">${balance.cash_balance.toFixed(2)}</span>
            </div>
          </div>
        </>
      ) : null}
    </Panel>
  );
}
