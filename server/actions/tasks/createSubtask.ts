"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";

export async function createSubtask(
  parentTaskId: string,
  title: string
): Promise<{ success: boolean; id?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false };
    if (!await checkWriteRateLimit(user.id)) return { success: false };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false };

    const trimmed = title.trim();
    if (!trimmed) return { success: false };

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tasks")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        parent_task_id: parentTaskId,
        title: trimmed,
        status: "todo",
        priority: "medium",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      logger.error("createSubtask failed", error);
      return { success: false };
    }

    return { success: true, id: data.id };
  } catch (err) {
    logger.error("createSubtask unexpected error", err);
    return { success: false };
  }
}
