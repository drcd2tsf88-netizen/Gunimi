import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";
import { getOnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";
import { getPipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";
import DashboardView from "@/components/dashboard/DashboardView";
import type { DashboardTask } from "@/components/dashboard/TodaysPrioritiesWidget";

export default async function DashboardPage() {
  const user = await getUser();

  const profilePromise = user
    ? createClient().then((s) =>
        s.from("profiles").select("full_name").eq("id", user.id).single()
      )
    : Promise.resolve({ data: null });

  const [
    rawTasks,
    events,
    onboardingStatus,
    pipeline,
    profileResult,
  ] = await Promise.all([
    getWorkspaceTasks(),
    getCalendarEvents(10),
    getOnboardingStatus(),
    getPipelineBreakdown(),
    profilePromise,
  ]);

  const displayName =
    (profileResult.data as { full_name?: string } | null)?.full_name ||
    user?.email?.split("@")[0] ||
    "Operator";

  const tasks = (rawTasks as unknown as DashboardTask[]) ?? [];

  return (
    <DashboardView
      displayName={displayName}
      tasks={tasks}
      events={events}
      onboardingStatus={onboardingStatus}
      pipeline={pipeline}
    />
  );
}
