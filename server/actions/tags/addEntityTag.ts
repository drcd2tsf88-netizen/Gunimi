"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";
import type { EntityType } from "@/types/tag";

export async function addEntityTag(
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
      .insert({
        workspace_id: workspace.id,
        tag_id: tagId,
        entity_type: entityType,
        entity_id: entityId,
      });

    if (error) {
      // Ignore unique constraint violations (tag already added)
      if (error.code === "23505") return true;
      logger.error("addEntityTag error:", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("addEntityTag exception:", err);
    return false;
  }
}
