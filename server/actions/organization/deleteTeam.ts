"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function deleteTeam(teamId: string): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_teams")
      .delete()
      .eq("id", teamId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteTeam error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
