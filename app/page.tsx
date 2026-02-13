import { AgentsPanel } from "@/components/shared/agents-panel";
import { MissionQueue } from "@/components/dashboard/mission-queue";
// import { LiveFeed } from "@/components/dashboard/live-feed";

export default function Home() {
  return (
    <div className="flex h-full overflow-hidden">
      <AgentsPanel />
      <MissionQueue />
      {/* <LiveFeed /> */}
    </div>
  );
}
