"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function removeTeamMember(membershipId: string): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    // Soft delete — preserve history (ADR-005: append-only)
    const { error } = await supabase
      .from("workspace_team_memberships")
      .update({ left_at: new Date().toISOString() })
      .eq("id", membershipId);

    if (error) {
      logger.error("removeTeamMember error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
