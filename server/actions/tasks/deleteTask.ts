"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: task } = await supabase
      .from("workspace_tasks")
      .select("title")
      .eq("id", taskId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    const { error } = await supabase
      .from("workspace_tasks")
      .delete()
      .eq("id", taskId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error(error);
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

    revalidatePath("/dashboard/tasks");

    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}
