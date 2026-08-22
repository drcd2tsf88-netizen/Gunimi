"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function deleteSubtask(subtaskId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_tasks")
      .delete()
      .eq("id", subtaskId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteSubtask failed", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("deleteSubtask unexpected error", err);
    return false;
  }
}
