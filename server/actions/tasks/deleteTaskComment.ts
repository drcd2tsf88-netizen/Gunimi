"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function deleteTaskComment(commentId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("task_comments")
      .delete()
      .eq("id", commentId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteTaskComment failed", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("deleteTaskComment unexpected error", err);
    return false;
  }
}
