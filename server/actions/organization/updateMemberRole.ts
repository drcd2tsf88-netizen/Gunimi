"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { TeamRole } from "@/types/organization";

export async function updateMemberRole(membershipId: string, role: TeamRole): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_team_memberships")
      .update({ role })
      .eq("id", membershipId);

    if (error) {
      logger.error("updateMemberRole error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
