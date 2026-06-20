"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: task } = await supabase
      .from("workspace_tasks")
      .select("title")
      .eq("id", taskId)
      .eq("workspace_id", workspace.id)
      .single();

    const { error } = await supabase
      .from("workspace_tasks")
      .delete()
      .eq("id", taskId)
      .eq("workspace_id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "task_deleted",
        title: "Task Deleted",
        description: task
          ? `Deleted task "${task.title}"`
          : "Deleted a task",
      });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
