import { Panel } from "@/components/shared/panel";
import { Zap } from "lucide-react";

export function AlwaysRunningSection() {
  return (
    <Panel className="mx-6">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-bold text-foreground">Always Running</h2>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Heartbeat polling is active for all agents via the gateway.
      </p>
    </Panel>
  );
}
