import { supabase }
from "@/lib/supabase";

import { getWorkspaceStats }
from "@/server/actions/dashboard/getWorkspaceStats";

import { runWorkspaceWatcher }
from "@/lib/autonomy/runworkspacewatcher";
import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

type LoadDashboardProps = {
  setLoading: (
    value: boolean
  ) => void;

  setStats: (
    value: any
  ) => void;

  setActivityFeed: (
    value: any[]
  ) => void;
};


export async function loadDashboard({
  setLoading,

  setStats,

  setActivityFeed,
}: LoadDashboardProps) {
  try {
    setLoading(true);
const workspace =
  await getCurrentWorkspace();

    // RUN AI WATCHER

    await runWorkspaceWatcher();

    // CONTACTS

    const {
      data: contacts,
    } = await supabase
      .from(
        "workspace_contacts"
      )
      .select("id");

    // NOTES

    const {
      data: notes,
    } = await supabase
      .from(
        "workspace_notes"
      )
      .select("id");

    // ACTIVITY

    const {
      data: activity,
    } = await supabase
      .from(
        "workspace_activity"
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(8);

    // TASK STATS

    const statsData =
      await getWorkspaceStats();

    // UPDATE STATS

    setStats({
      ...statsData,

      contacts:
        contacts?.length ?? 0,

      notes:
        notes?.length ?? 0,

      activity:
        activity?.length ?? 0,
    });

    // UPDATE ACTIVITY

    setActivityFeed(
      activity ?? []
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}