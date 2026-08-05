"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceAssignmentWithActor } from "@/types/organization";

type GetAssignmentsInput = {
  entityType: string;
  entityId: string;
  includeCompleted?: boolean;
};

export async function getAssignments(
  input: GetAssignmentsInput
): Promise<WorkspaceAssignmentWithActor[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    let query = supabase
      .from("workspace_assignments")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("entity_type", input.entityType)
      .eq("entity_id", input.entityId)
      .order("created_at", { ascending: true });

    if (!input.includeCompleted) {
      query = query.not("status", "in", '("completed","cancelled")');
    }

    const { data, error } = await query;

    if (error) {
      logger.error("getAssignments error:", error);
      return [];
    }

    const assignments = data ?? [];

    // Enrich with team info for team-type actors
    const teamIds = assignments
      .filter((a) => a.actor_type === "team")
      .map((a) => a.actor_id);

    let teamsMap: Record<string, { id: string; name: string; color: string }> = {};
    if (teamIds.length > 0) {
      const { data: teams } = await supabase
        .from("workspace_teams")
        .select("id, name, color")
        .in("id", teamIds);
      teamsMap = Object.fromEntries((teams ?? []).map((t) => [t.id, t]));
    }

    return assignments.map((a) => ({
      ...a,
      team: a.actor_type === "team" ? (teamsMap[a.actor_id] ?? null) : null,
    })) as WorkspaceAssignmentWithActor[];
  } catch {
    return [];
  }
}
