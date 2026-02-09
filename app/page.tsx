import { TopBar } from "@/components/dashboard/TopBar";
import { AgentsPanel } from "@/components/dashboard/AgentsPanel";
import { MissionQueue } from "@/components/dashboard/MissionQueue";
import { LiveFeed } from "@/components/dashboard/LiveFeed";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-stone-50 font-sans">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <AgentsPanel />
        <MissionQueue />
        <LiveFeed />
      </div>
    </div>
  );
}
