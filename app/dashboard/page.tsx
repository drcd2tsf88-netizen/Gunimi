import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getTodayData } from "@/server/actions/today/getTodayData";
import { getAiBrief } from "@/server/actions/today/getAiBrief";
import { getWorkspaceState } from "@/server/actions/workspace/getWorkspaceState";
import { getSignalCounts } from "@/server/actions/signals/getSignalCounts";
import { getWorkspaceTimeline } from "@/server/actions/memory/getWorkspaceTimeline";
import TodayView from "@/components/today/TodayView";
import WorkspaceAwakening from "@/components/today/WorkspaceAwakening";
import WorkspaceAwakenedMoment from "@/components/today/WorkspaceAwakenedMoment";

export async function generateMetadata() {
  const t = await getTranslations("today");
  return { title: t("pageTitle") };
}

export default async function TodayPage() {
  const user = await getUser();

  const profilePromise = user
    ? createClient().then((s) =>
        s.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      )
    : Promise.resolve({ data: null });

  const [todayData, profileResult, wsState, signalCounts, recentMemory, aiBrief] = await Promise.all([
    getTodayData(),
    profilePromise,
    getWorkspaceState(),
    getSignalCounts(),
    getWorkspaceTimeline(3),
    getAiBrief(),
  ]);

  const displayName =
    (profileResult.data as { full_name?: string } | null)?.full_name ||
    user?.email?.split("@")[0] ||
    "—";

  if (wsState === "awakening") {
    return <WorkspaceAwakening displayName={displayName} />;
  }

  return (
    <WorkspaceAwakenedMoment>
      <TodayView
        displayName={displayName}
        health={todayData.health}
        focus={todayData.focus}
        attention={todayData.attention}
        relationships={todayData.relationships}
        work={todayData.work}
        calmContext={todayData.calmContext}
        aiBrief={aiBrief}
        signalCount={signalCounts.total}
        criticalSignalCount={signalCounts.critical}
        recentMemory={recentMemory}
      />
    </WorkspaceAwakenedMoment>
  );
}
