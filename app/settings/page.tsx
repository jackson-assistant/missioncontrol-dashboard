"use client";

import { useState } from "react";
import {
  Settings,
  Key,
  Radio,
  Cpu,
  Bell,
  AlertTriangle,
  Save,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "@/components/dashboard/ui/panel";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { CodeBadge } from "@/components/dashboard/ui/code-badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  defaultSettings,
  timezones,
  dateFormats,
  availableModels,
  refreshIntervals,
  type AppSettings,
} from "@/lib/settings-data";

// ── Shared Styles ───────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-md border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring";

const selectClass =
  "w-full rounded-md border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring";

// ── Reusable Pieces ─────────────────────────────────────────────────────────

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-8 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
      <div className="w-[280px] shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-emerald-500" : "bg-stone-300 dark:bg-zinc-600"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function SectionPanel({
  id,
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div id={id}>
      <Panel className={className}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Icon className="h-3.5 w-3.5 text-dim" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="divide-y divide-dashed">{children}</div>
      </Panel>
    </div>
  );
}

// ── Sidebar Nav ─────────────────────────────────────────────────────────────

const sidebarSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "gateway", label: "Gateway", icon: Radio },
  { id: "models", label: "Models", icon: Cpu },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

// ── Main Page ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Generic updater for top-level section keys
  const update = <K extends keyof AppSettings>(
    section: K,
    key: keyof AppSettings[K],
    value: AppSettings[K][keyof AppSettings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setSaved(false);
  };

  const toggleChannel = (ch: keyof AppSettings["notifications"]["channels"]) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        channels: {
          ...prev.notifications.channels,
          [ch]: !prev.notifications.channels[ch],
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  s.id === "danger"
                    ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    : "text-dim hover:bg-muted hover:text-foreground"
                }`}
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
              Changes are applied locally. Real integration coming soon.
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

          {/* ── General ──────────────────────────────────────────────── */}

          <SectionPanel
            id="general"
            title="General"
            description="App name, timezone, and display preferences"
            icon={Settings}
          >
            <SettingRow
              label="Dashboard Name"
              hint="Displayed in the header and browser tab"
            >
              <input
                type="text"
                className={inputClass}
                value={settings.general.dashboardName}
                onChange={(e) =>
                  update("general", "dashboardName", e.target.value)
                }
              />
            </SettingRow>

            <SettingRow
              label="Timezone"
              hint="Used for log timestamps and scheduling"
            >
              <select
                className={selectClass}
                value={settings.general.timezone}
                onChange={(e) =>
                  update("general", "timezone", e.target.value)
                }
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow label="Date Format">
              <select
                className={selectClass}
                value={settings.general.dateFormat}
                onChange={(e) =>
                  update("general", "dateFormat", e.target.value)
                }
              >
                {dateFormats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow
              label="Auto-Refresh"
              hint="How often to poll for new data"
            >
              <select
                className={selectClass}
                value={settings.general.autoRefreshInterval}
                onChange={(e) =>
                  update(
                    "general",
                    "autoRefreshInterval",
                    Number(e.target.value)
                  )
                }
              >
                {refreshIntervals.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </SettingRow>
          </SectionPanel>

          {/* ── API Keys ─────────────────────────────────────────────── */}

          <SectionPanel
            id="api-keys"
            title="API Keys"
            description="Manage provider credentials"
            icon={Key}
          >
            <SettingRow
              label="Moonshot API Key"
              hint="Used for Kimi K2.5 model access"
            >
              <div className="flex gap-2">
                <input
                  type={showApiKeys.moonshot ? "text" : "password"}
                  className={`${inputClass} flex-1 font-mono text-xs`}
                  value={settings.apiKeys.moonshotApiKey}
                  onChange={(e) =>
                    update("apiKeys", "moonshotApiKey", e.target.value)
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowApiKeys((prev) => ({
                      ...prev,
                      moonshot: !prev.moonshot,
                    }))
                  }
                >
                  {showApiKeys.moonshot ? "Hide" : "Show"}
                </Button>
              </div>
            </SettingRow>

            <SettingRow
              label="Gateway Token"
              hint="Auth token for the OpenClaw gateway"
            >
              <div className="flex gap-2">
                <input
                  type={showApiKeys.gateway ? "text" : "password"}
                  className={`${inputClass} flex-1 font-mono text-xs`}
                  value={settings.apiKeys.gatewayToken}
                  onChange={(e) =>
                    update("apiKeys", "gatewayToken", e.target.value)
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowApiKeys((prev) => ({
                      ...prev,
                      gateway: !prev.gateway,
                    }))
                  }
                >
                  {showApiKeys.gateway ? "Hide" : "Show"}
                </Button>
              </div>
            </SettingRow>
          </SectionPanel>

          {/* ── Gateway ──────────────────────────────────────────────── */}

          <SectionPanel
            id="gateway"
            title="Gateway"
            description="WebSocket connection and auth settings"
            icon={Radio}
          >
            <SettingRow
              label="Gateway URL"
              hint="WebSocket endpoint for the OpenClaw gateway"
            >
              <input
                type="text"
                className={`${inputClass} font-mono text-xs`}
                value={settings.gateway.url}
                onChange={(e) => update("gateway", "url", e.target.value)}
              />
            </SettingRow>

            <SettingRow label="Auth Mode">
              <select
                className={selectClass}
                value={settings.gateway.authMode}
                onChange={(e) =>
                  update(
                    "gateway",
                    "authMode",
                    e.target.value as "token" | "password"
                  )
                }
              >
                <option value="token">Token</option>
                <option value="password">Password</option>
              </select>
            </SettingRow>

            <SettingRow
              label="Connection Timeout"
              hint="Milliseconds before timing out"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className={inputClass}
                  value={settings.gateway.connectionTimeout}
                  onChange={(e) =>
                    update(
                      "gateway",
                      "connectionTimeout",
                      Number(e.target.value)
                    )
                  }
                />
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </SettingRow>

            <SettingRow
              label="Auto-Reconnect"
              hint="Automatically reconnect on connection loss"
            >
              <Toggle
                enabled={settings.gateway.autoReconnect}
                onToggle={() =>
                  update(
                    "gateway",
                    "autoReconnect",
                    !settings.gateway.autoReconnect
                  )
                }
              />
            </SettingRow>

            <SettingRow
              label="Max Retries"
              hint="Number of reconnection attempts"
            >
              <input
                type="number"
                className={inputClass}
                value={settings.gateway.maxRetries}
                onChange={(e) =>
                  update("gateway", "maxRetries", Number(e.target.value))
                }
                min={0}
                max={10}
              />
            </SettingRow>
          </SectionPanel>

          {/* ── Models ───────────────────────────────────────────────── */}

          <SectionPanel
            id="models"
            title="Model Defaults"
            description="Default model configuration for agents"
            icon={Cpu}
          >
            <SettingRow
              label="Default Model"
              hint="Primary model for agent tasks"
            >
              <select
                className={selectClass}
                value={settings.models.defaultModel}
                onChange={(e) =>
                  update("models", "defaultModel", e.target.value)
                }
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow
              label="Fallback Model"
              hint="Used when primary model is unavailable"
            >
              <select
                className={selectClass}
                value={settings.models.fallbackModel}
                onChange={(e) =>
                  update("models", "fallbackModel", e.target.value)
                }
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow
              label="Max Tokens"
              hint="Maximum tokens per API request"
            >
              <input
                type="number"
                className={inputClass}
                value={settings.models.maxTokensPerRequest}
                onChange={(e) =>
                  update(
                    "models",
                    "maxTokensPerRequest",
                    Number(e.target.value)
                  )
                }
                min={256}
                max={128000}
                step={256}
              />
            </SettingRow>

            <SettingRow
              label="Temperature"
              hint="Model creativity (0 = deterministic, 1 = creative)"
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  className="flex-1 accent-stone-800 dark:accent-zinc-300"
                  min={0}
                  max={1}
                  step={0.1}
                  value={settings.models.temperature}
                  onChange={(e) =>
                    update("models", "temperature", Number(e.target.value))
                  }
                />
                <CodeBadge className="text-xs tabular-nums">
                  {settings.models.temperature.toFixed(1)}
                </CodeBadge>
              </div>
            </SettingRow>
          </SectionPanel>

          {/* ── Notifications ────────────────────────────────────────── */}

          <SectionPanel
            id="notifications"
            title="Notifications"
            description="Alert thresholds and delivery channels"
            icon={Bell}
          >
            <SettingRow
              label="Low Balance Alert"
              hint="Warn when API balance drops below this amount"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  className={inputClass}
                  value={settings.notifications.lowBalanceThreshold}
                  onChange={(e) =>
                    update(
                      "notifications",
                      "lowBalanceThreshold",
                      Number(e.target.value)
                    )
                  }
                  min={0}
                  step={1}
                />
              </div>
            </SettingRow>

            <SettingRow
              label="Error Rate Alert"
              hint="Alert when error rate exceeds this percentage"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className={inputClass}
                  value={settings.notifications.errorRateAlert}
                  onChange={(e) =>
                    update(
                      "notifications",
                      "errorRateAlert",
                      Number(e.target.value)
                    )
                  }
                  min={0}
                  max={100}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </SettingRow>

            <SettingRow
              label="Agent Offline Timeout"
              hint="Minutes before an agent is considered offline"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className={inputClass}
                  value={settings.notifications.agentOfflineTimeout}
                  onChange={(e) =>
                    update(
                      "notifications",
                      "agentOfflineTimeout",
                      Number(e.target.value)
                    )
                  }
                  min={1}
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </SettingRow>

            <SettingRow
              label="Email Notifications"
              hint="Send alerts via email"
            >
              <Toggle
                enabled={settings.notifications.emailNotifications}
                onToggle={() =>
                  update(
                    "notifications",
                    "emailNotifications",
                    !settings.notifications.emailNotifications
                  )
                }
              />
            </SettingRow>

            <SettingRow
              label="Notification Channels"
              hint="Select which channels receive alerts"
            >
              <div className="flex flex-wrap gap-2">
                {(
                  Object.keys(settings.notifications.channels) as Array<
                    keyof AppSettings["notifications"]["channels"]
                  >
                ).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => toggleChannel(ch)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      settings.notifications.channels[ch]
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-stone-200 bg-muted text-dim hover:bg-stone-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </SettingRow>
          </SectionPanel>

          {/* ── Danger Zone ──────────────────────────────────────────── */}

          <div id="danger">
            <Panel className="border-rose-200 dark:border-rose-800/50">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Danger Zone
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Irreversible actions
                  </p>
                </div>
              </div>
              <Separator className="my-3" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Reset All Settings
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Restore all settings to their default values
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
                    onClick={() => {
                      setSettings(defaultSettings);
                      setSaved(false);
                    }}
                  >
                    Reset Settings
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Clear Agent Data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Remove all cached agent state and memory
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
                  >
                    Clear Data
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Purge Logs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Delete all log entries permanently
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
                  >
                    Purge Logs
                  </Button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
