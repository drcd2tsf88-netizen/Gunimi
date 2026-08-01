"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";
import type { EntityType } from "@/types/tag";

export async function removeEntityTag(
  entityType: EntityType,
  entityId: string,
  tagId: string,
): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_entity_tags")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("tag_id", tagId)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);

    if (error) {
      logger.error("removeEntityTag error:", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("removeEntityTag exception:", err);
    return false;
  }
}
