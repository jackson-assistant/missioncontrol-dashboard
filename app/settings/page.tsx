"use client";

import { useState } from "react";
import {
  Settings,
  Key,
  Cpu,
  Bell,
  Save,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionPanel } from "@/components/settings/section-panel";
import { SettingRow } from "@/components/settings/setting-row";
import { useConfig } from "@/lib/hooks";
import {
  timezones,
  dateFormats,
  refreshIntervals,
} from "@/lib/settings-data";

const inputClass =
  "w-full rounded-md border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring";

const selectClass =
  "w-full rounded-md border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring";

const sidebarSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "agents", label: "Agents", icon: Cpu },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { config, isLoading: configLoading } = useConfig();

  const [localSettings, setLocalSettings] = useState({
    timezone: "Australia/Sydney",
    dateFormat: "DD/MM/YYYY",
    autoRefreshInterval: 30,
    lowBalanceThreshold: 10,
    agentOfflineTimeout: 15,
  });
  const [saved, setSaved] = useState(false);

  const updateLocal = (key: string, value: unknown) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Extract live data
  const defaults = config?.defaults || {};
  const primaryModel = defaults?.model?.primary || "—";
  const imageModel = defaults?.imageModel?.primary || "—";
  const modelAliases = defaults?.models || {};
  const configAgents = config?.agents || [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="flex w-[200px] shrink-0 flex-col border-r border-dashed bg-stone-50/50 dark:bg-zinc-800/60">
        <div className="p-4">
          <PageHeader icon={Settings} title="Settings" />
        </div>
        <nav className="space-y-0.5 px-2">
          {sidebarSections.map((s) => {
            const SIcon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-dim transition-colors hover:bg-muted hover:text-foreground"
              >
                <SIcon className="h-3.5 w-3.5" />
                {s.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl space-y-4 p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Live configuration from OpenClaw gateway
            </p>
            <Button size="sm" onClick={handleSave}>
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* General */}
          <SectionPanel id="general" title="General" description="Display and refresh preferences" icon={Settings}>
            <SettingRow label="Timezone" hint="Used for log timestamps and scheduling">
              <select className={selectClass} value={localSettings.timezone} onChange={(e) => updateLocal("timezone", e.target.value)}>
                {timezones.map((tz) => (<option key={tz} value={tz}>{tz}</option>))}
              </select>
            </SettingRow>
            <SettingRow label="Date Format">
              <select className={selectClass} value={localSettings.dateFormat} onChange={(e) => updateLocal("dateFormat", e.target.value)}>
                {dateFormats.map((f) => (<option key={f} value={f}>{f}</option>))}
              </select>
            </SettingRow>
            <SettingRow label="Auto-Refresh" hint="How often to poll for new data">
              <select className={selectClass} value={localSettings.autoRefreshInterval} onChange={(e) => updateLocal("autoRefreshInterval", Number(e.target.value))}>
                {refreshIntervals.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
              </select>
            </SettingRow>
          </SectionPanel>

          {/* Agents & Models (live read-only) */}
          <SectionPanel id="agents" title="Agents & Models" description="Live configuration from OpenClaw" icon={Cpu}>
            <SettingRow label="Primary Model" hint="Default model for all agents">
              <div className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm font-mono text-foreground">
                {configLoading ? "Loading..." : primaryModel}
              </div>
            </SettingRow>
            <SettingRow label="Image Model" hint="Model used for image analysis">
              <div className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm font-mono text-foreground">
                {configLoading ? "Loading..." : imageModel}
              </div>
            </SettingRow>

            {Object.keys(modelAliases).length > 0 && (
              <SettingRow label="Model Aliases" hint="Configured shorthand aliases">
                <div className="space-y-1">
                  {Object.entries(modelAliases).map(([model, cfg]: [string, any]) => (
                    <div key={model} className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-1 text-xs">
                      <span className="font-mono text-foreground">{model}</span>
                      <span className="text-muted-foreground">→ {cfg.alias || "—"}</span>
                    </div>
                  ))}
                </div>
              </SettingRow>
            )}

            <SettingRow label="Agents" hint="Registered agents and their models">
              <div className="space-y-1">
                {configAgents.map((agent: any) => (
                  <div key={agent.id} className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{agent.name}</span>
                      {agent.isDefault && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          default
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-muted-foreground">{agent.model}</span>
                  </div>
                ))}
              </div>
            </SettingRow>
          </SectionPanel>

          {/* API Keys */}
          <SectionPanel id="api-keys" title="API Keys" description="Manage provider credentials" icon={Key}>
            <SettingRow label="Moonshot API Key" hint="Managed separately via environment variable">
              <div className="flex gap-2 items-center">
                <input
                  type="password"
                  placeholder="Set via MOONSHOT_API_KEY env"
                  className={`${inputClass} flex-1 font-mono text-xs`}
                  disabled
                />
              </div>
            </SettingRow>
          </SectionPanel>

          {/* Notifications */}
          <SectionPanel id="notifications" title="Notifications" description="Alert thresholds" icon={Bell}>
            <SettingRow label="Low Balance Alert" hint="Warn when API balance drops below this amount">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input type="number" className={inputClass} value={localSettings.lowBalanceThreshold} onChange={(e) => updateLocal("lowBalanceThreshold", Number(e.target.value))} min={0} step={1} />
              </div>
            </SettingRow>
            <SettingRow label="Agent Offline Timeout" hint="Minutes before an agent is considered offline">
              <div className="flex items-center gap-2">
                <input type="number" className={inputClass} value={localSettings.agentOfflineTimeout} onChange={(e) => updateLocal("agentOfflineTimeout", Number(e.target.value))} min={1} />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </SettingRow>
          </SectionPanel>
        </div>
      </ScrollArea>
    </div>
  );
}
