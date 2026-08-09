"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";

export async function createTaskComment(
  taskId: string,
  content: string
): Promise<{ success: boolean; id?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false };
    if (!await checkWriteRateLimit()) return { success: false };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false };

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 4000) return { success: false };

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("task_comments")
      .insert({
        workspace_id: workspace.id,
        task_id: taskId,
        user_id: user.id,
        content: trimmed,
      })
      .select("id")
      .single();

    if (error) {
      logger.error("createTaskComment failed", error);
      return { success: false };
    }

    return { success: true, id: data.id };
  } catch (err) {
    logger.error("createTaskComment unexpected error", err);
    return { success: false };
  }
}
