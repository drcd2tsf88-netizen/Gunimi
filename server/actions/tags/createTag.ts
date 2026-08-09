"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export async function createTag(name: string, color: string): Promise<WorkspaceTag | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit()) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const cleanName = name.trim();
    if (!cleanName) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tags")
      .insert({ workspace_id: workspace.id, name: cleanName, color })
      .select("id, workspace_id, name, color, created_at")
      .single();

    if (error) {
      logger.error("createTag error:", error);
      return null;
    }

    return data as WorkspaceTag;
  } catch (err) {
    logger.error("createTag exception:", err);
    return null;
  }
}
