import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getTodayData } from "@/server/actions/today/getTodayData";
import { getWorkspaceState } from "@/server/actions/workspace/getWorkspaceState";
import { getWorkspaceSignals } from "@/server/actions/signals/getWorkspaceSignals";
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

  const [todayData, profileResult, wsState, signals, recentMemory] = await Promise.all([
    getTodayData(),
    profilePromise,
    getWorkspaceState(),
    getWorkspaceSignals(),
    getWorkspaceTimeline(3),
  ]);

  const displayName =
    (profileResult.data as { full_name?: string } | null)?.full_name ||
    user?.email?.split("@")[0] ||
    "—";

  if (wsState === "awakening") {
    return <WorkspaceAwakening displayName={displayName} />;
  }

  const criticalSignalCount = signals.filter((s) => s.severity === "critical").length;

  return (
    <WorkspaceAwakenedMoment>
      <TodayView
        displayName={displayName}
        health={todayData.health}
        focus={todayData.focus}
        attention={todayData.attention}
        relationships={todayData.relationships}
        work={todayData.work}
        signalCount={signals.length}
        criticalSignalCount={criticalSignalCount}
        recentMemory={recentMemory}
      />
    </WorkspaceAwakenedMoment>
  );
}
