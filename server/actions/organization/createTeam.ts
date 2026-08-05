"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTeam, TeamType } from "@/types/organization";

type CreateTeamInput = {
  name: string;
  description?: string;
  color?: string;
  team_type?: TeamType;
  parent_team_id?: string | null;
};

export async function createTeam(input: CreateTeamInput): Promise<WorkspaceTeam | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_teams")
      .insert({
        workspace_id: workspace.id,
        name: input.name.trim(),
        description: input.description?.trim() ?? null,
        color: input.color ?? "#6D5BFF",
        team_type: input.team_type ?? "team",
        parent_team_id: input.parent_team_id ?? null,
      })
      .select()
      .single();

    if (error) {
      logger.error("createTeam error:", error);
      return null;
    }

    return data as WorkspaceTeam;
  } catch {
    return null;
  }
}
