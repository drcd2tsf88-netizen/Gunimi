"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag, EntityType } from "@/types/tag";

export async function getEntityTags(
  entityType: EntityType,
  entityId: string,
): Promise<WorkspaceTag[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_entity_tags")
      .select("workspace_tags(id, workspace_id, name, color, created_at)")
      .eq("workspace_id", workspace.id)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);

    if (error) {
      logger.error("getEntityTags error:", error);
      return [];
    }

    return (data ?? [])
      .map((row) => row.workspace_tags as unknown as WorkspaceTag | null)
      .filter((t): t is WorkspaceTag => t !== null);
  } catch (err) {
    logger.error("getEntityTags exception:", err);
    return [];
  }
}
