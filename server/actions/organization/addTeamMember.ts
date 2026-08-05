"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { TeamRole } from "@/types/organization";

type AddTeamMemberInput = {
  teamId: string;
  memberId: string;
  role?: TeamRole;
};

export async function addTeamMember(input: AddTeamMemberInput): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    // Verify team belongs to this workspace
    const { data: team } = await supabase
      .from("workspace_teams")
      .select("id")
      .eq("id", input.teamId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!team) return false;

    // Upsert — if member left and rejoins, reactivate
    const { error } = await supabase
      .from("workspace_team_memberships")
      .upsert(
        {
          team_id: input.teamId,
          actor_id: input.memberId,
          role: input.role ?? "member",
          joined_at: new Date().toISOString(),
          left_at: null,
        },
        { onConflict: "team_id,actor_id" }
      );

    if (error) {
      logger.error("addTeamMember error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
