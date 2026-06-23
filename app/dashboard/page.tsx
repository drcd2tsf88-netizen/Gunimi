import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";
import { getEmailThreads } from "@/server/actions/email/getEmailThreads";
import { getWorkspaceActivity } from "@/server/actions/activity/getWorkspaceActivity";
import DashboardView from "@/components/dashboard/DashboardView";
import type { DashboardTask } from "@/components/dashboard/PriorityTasksWidget";
import type { DashboardActivityItem } from "@/components/dashboard/RecentActivityWidget";

export default async function DashboardPage() {
  const user = await getUser();

  const [analytics, rawTasks, events, threads, rawActivities] = await Promise.all([
    getAnalyticsOverview(),
    getWorkspaceTasks(),
    getCalendarEvents(5),
    getEmailThreads(5),
    getWorkspaceActivity(8),
  ]);

  let displayName = "Operator";
  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    displayName =
      (profile as { full_name?: string } | null)?.full_name ||
      user.email?.split("@")[0] ||
      "Operator";
  }

  const tasks = (rawTasks as unknown as DashboardTask[]) ?? [];
  const activities = (rawActivities as unknown as DashboardActivityItem[]) ?? [];

  return (
    <DashboardView
      displayName={displayName}
      analytics={analytics}
      tasks={tasks}
      events={events}
      threads={threads}
      activities={activities}
    />
  );
}
