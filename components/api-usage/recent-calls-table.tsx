import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/empty-state";

export function RecentCallsTable() {
  return (
    <Panel padding="none" className="flex-1 overflow-hidden">
      <div className="border-b border-dashed px-4 py-3">
        <h2 className="text-sm font-bold text-foreground">Recent API Calls</h2>
        <p className="text-xs text-muted-foreground">
          API call tracking not yet available
        </p>
      </div>
      <EmptyState
        message="No API call data"
        hint="API usage tracking will be available in a future update"
        className="py-12"
      />
    </Panel>
  );
}
