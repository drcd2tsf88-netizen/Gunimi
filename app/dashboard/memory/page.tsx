import { getTranslations } from "next-intl/server";
import {
  getWorkspaceTimeline,
  getWorkspaceMemoryMilestones,
  getMemoryStats,
} from "@/server/actions/memory/getWorkspaceTimeline";
import MemoryTimelineView from "@/components/memory/MemoryTimelineView";

export async function generateMetadata() {
  const t = await getTranslations("memory");
  return { title: t("pageTitle") };
}

export default async function MemoryPage() {
  const [timeline, milestones, stats] = await Promise.all([
    getWorkspaceTimeline(60),
    getWorkspaceMemoryMilestones(12),
    getMemoryStats(),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <MemoryTimelineView timeline={timeline} milestones={milestones} stats={stats} />
    </div>
  );
}
