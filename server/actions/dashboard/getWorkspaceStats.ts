"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceStats() {
  try {
    const workspace = await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }

    const supabase = await createClient();

    const [
      { count: totalTasks },
      { count: doneTasks },
      { count: contactCount },
      { count: noteCount },
      { count: activityCount },
    ] = await Promise.all([
      supabase
        .from("workspace_tasks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      supabase
        .from("workspace_tasks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .eq("status", "done"),

      supabase
        .from("workspace_contacts")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      supabase
        .from("workspace_notes")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),

      supabase
        .from("workspace_activity")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);

    return {
      tasks: totalTasks ?? 0,
      completedTasks: doneTasks ?? 0,
      contacts: contactCount ?? 0,
      notes: noteCount ?? 0,
      activityCount: activityCount ?? 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
