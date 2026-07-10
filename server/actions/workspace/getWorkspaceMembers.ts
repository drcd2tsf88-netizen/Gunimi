"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function getWorkspaceMembers() {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_members")
      .select(`
        id,
        role,
        user_id,
        profiles (
          id,
          email,
          full_name,
          avatar_url,
          status
        )
      `)
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: true });

    if (error) {
      logger.error("getWorkspaceMembers error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error("getWorkspaceMembers failed:", error);
    return [];
  }
}
