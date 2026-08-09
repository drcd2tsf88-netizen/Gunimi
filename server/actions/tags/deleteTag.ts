"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";

export async function deleteTag(tagId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit()) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_tags")
      .delete()
      .eq("id", tagId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteTag error:", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("deleteTag exception:", err);
    return false;
  }
}
