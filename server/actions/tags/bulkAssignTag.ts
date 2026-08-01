"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import type { EntityType } from "@/types/tag";

export async function bulkAssignTag(
  entityType: EntityType,
  entityIds: string[],
  tagId: string,
): Promise<{ assigned: number; error?: string }> {
  if (!entityIds.length) return { assigned: 0 };

  try {
    const user = await getUser();
    if (!user) return { assigned: 0, error: "unauthenticated" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { assigned: 0, error: "no_workspace" };

    const supabase = await createClient();

    const rows = entityIds.map((entityId) => ({
      workspace_id: workspace.id,
      tag_id: tagId,
      entity_type: entityType,
      entity_id: entityId,
    }));

    const { error } = await supabase
      .from("workspace_entity_tags")
      .upsert(rows, { onConflict: "workspace_id,tag_id,entity_type,entity_id", ignoreDuplicates: true });

    if (error) {
      logger.error("bulkAssignTag error:", error);
      return { assigned: 0, error: "db_error" };
    }

    return { assigned: entityIds.length };
  } catch (err) {
    logger.error("bulkAssignTag exception:", err);
    return { assigned: 0, error: "unexpected" };
  }
}
