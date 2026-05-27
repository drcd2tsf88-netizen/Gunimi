"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceStats() {
  try {
    const workspace =
      await getCurrentWorkspace();

    const supabase = await createClient();

    if (!workspace) {
      return null;
    }

    // TASKS

    const {
      data: tasks,
    } =
      await supabase
        .from(
          "workspace_tasks"
        )
        .select("*")
        .eq(
          "workspace_id",
          workspace.id
        );

    // ACTIVITY

    const {
      data: activity,
    } =
      await supabase
        .from(
          "workspace_activity"
        )
        .select("*")
        .eq(
          "workspace_id",
          workspace.id
        );

    const activeTasks =
      tasks?.filter(
        (task) =>
          task.status ===
          "active"
      ).length || 0;

    const completedTasks =
      tasks?.filter(
        (task) =>
          task.status ===
          "completed"
      ).length || 0;

    return {
      activeTasks,

      completedTasks,

      activityCount:
        activity?.length || 0,
    };
  } catch (error) {
    console.error(error);

    return null;
  }
}