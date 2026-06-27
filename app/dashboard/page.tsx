import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";
import { getWorkspaceActivity } from "@/server/actions/activity/getWorkspaceActivity";
import { getOnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";
import { getPipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";
import DashboardView from "@/components/dashboard/DashboardView";
import type { DashboardTask } from "@/components/dashboard/TodaysPrioritiesWidget";
import type { DashboardActivityItem } from "@/components/dashboard/MorningSummaryWidget";

export default async function DashboardPage() {
  const user = await getUser();

  const profilePromise = user
    ? createClient().then((s) =>
        s.from("profiles").select("full_name").eq("id", user.id).single()
      )
    : Promise.resolve({ data: null });

  const [
    analytics,
    rawTasks,
    events,
    rawActivities,
    onboardingStatus,
    pipeline,
    profileResult,
  ] = await Promise.all([
    getAnalyticsOverview(),
    getWorkspaceTasks(),
    getCalendarEvents(10),
    getWorkspaceActivity(10),
    getOnboardingStatus(),
    getPipelineBreakdown(),
    profilePromise,
  ]);

  const displayName =
    (profileResult.data as { full_name?: string } | null)?.full_name ||
    user?.email?.split("@")[0] ||
    "Operator";

  const tasks = (rawTasks as unknown as DashboardTask[]) ?? [];
  const activities = (rawActivities as unknown as DashboardActivityItem[]) ?? [];

  return (
    <DashboardView
      displayName={displayName}
      analytics={analytics}
      tasks={tasks}
      events={events}
      activities={activities}
      onboardingStatus={onboardingStatus}
      pipeline={pipeline}
    />
  );
}
