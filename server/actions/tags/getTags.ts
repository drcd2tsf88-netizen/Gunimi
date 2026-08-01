"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export async function getTags(): Promise<WorkspaceTag[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tags")
      .select("id, workspace_id, name, color, created_at")
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true });

    if (error) {
      logger.error("getTags error:", error);
      return [];
    }

    return (data ?? []) as WorkspaceTag[];
  } catch (err) {
    logger.error("getTags exception:", err);
    return [];
  }
}
