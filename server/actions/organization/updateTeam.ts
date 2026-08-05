"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

type UpdateTeamInput = {
  teamId: string;
  name?: string;
  description?: string | null;
  color?: string;
};

export async function updateTeam(input: UpdateTeamInput): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name.trim();
    if (input.description !== undefined) patch.description = input.description;
    if (input.color !== undefined) patch.color = input.color;

    const { error } = await supabase
      .from("workspace_teams")
      .update(patch)
      .eq("id", input.teamId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("updateTeam error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
