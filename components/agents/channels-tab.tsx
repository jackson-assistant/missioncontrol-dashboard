"use client";

import { useState, useEffect } from "react";
import { useChannels } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";
import { RefreshCw } from "lucide-react";

function ChannelCard({ name, channel }: { name: string; channel: any }) {
  const probeOk = channel.probe?.ok;

  return (
    <Panel className="bg-stone-50 dark:bg-zinc-800/80">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground capitalize">{name}</h4>
          <p className="text-xs text-muted-foreground">
            {channel.configured ? "Configured" : "Not configured"}
          </p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-xs text-subtle">
            <span className={`font-bold ${channel.running ? "text-emerald-500" : "text-stone-400"}`}>
              {channel.running ? "Running" : "Stopped"}
            </span>
          </p>
          {channel.probe && (
            <p className="text-xs text-dim">
              Probe: {probeOk ? "✅ OK" : "❌ Failed"} ({channel.probe.elapsedMs}ms)
            </p>
          )}
          {channel.probe?.bot && (
            <p className="text-xs text-dim">
              Bot: @{channel.probe.bot.username}
            </p>
          )}
          {channel.mode && (
            <p className="text-xs text-dim">Mode: {channel.mode}</p>
          )}
        </div>
      </div>
    </Panel>
  );
}

export function ChannelsTab() {
  const { channels, isLoading, mutate } = useChannels();
  const [lastRefresh, setLastRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastRefresh(0);
    mutate();
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const channelEntries = channels?.channels
    ? Object.entries(channels.channels)
    : [];

  return (
    <div className="space-y-4">
      <Panel padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Channels</h3>
            <p className="text-xs text-muted-foreground">
              Gateway-wide channel status snapshot.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Last refresh: {lastRefresh}s ago
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`h-3 w-3 ${refreshing || isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading && channelEntries.length === 0 ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : channelEntries.length > 0 ? (
            channelEntries.map(([name, channel]) => (
              <ChannelCard key={name} name={name} channel={channel} />
            ))
          ) : (
            <EmptyState message="No channels configured" className="py-4" />
          )}
        </div>
      </Panel>
    </div>
  );
}
