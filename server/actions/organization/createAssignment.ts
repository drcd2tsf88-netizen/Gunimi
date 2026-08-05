"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type {
  WorkspaceAssignment,
  ActorType,
  Responsibility,
  DecisionContext,
} from "@/types/organization";

type CreateAssignmentInput = {
  entityType: string;
  entityId: string;
  actorType: ActorType;
  actorId: string;
  responsibility: Responsibility;
  decisionContext?: DecisionContext;
};

export async function createAssignment(
  input: CreateAssignmentInput
): Promise<WorkspaceAssignment | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_assignments")
      .insert({
        workspace_id: workspace.id,
        entity_type: input.entityType,
        entity_id: input.entityId,
        actor_type: input.actorType,
        actor_id: input.actorId,
        responsibility: input.responsibility,
        decision_context: input.decisionContext ?? null,
        status: "active",
        active_from: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error("createAssignment error:", error);
      return null;
    }

    return data as WorkspaceAssignment;
  } catch {
    return null;
  }
}
