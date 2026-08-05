"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { AssignmentStatus } from "@/types/organization";

type UpdateAssignmentStatusInput = {
  assignmentId: string;
  status: AssignmentStatus;
  closedReason?: string;
};

export async function updateAssignmentStatus(
  input: UpdateAssignmentStatusInput
): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const patch: Record<string, unknown> = { status: input.status };

    if (input.status === "completed" || input.status === "cancelled") {
      patch.active_until = new Date().toISOString();
      patch.closed_reason = input.closedReason ?? null;
    }

    const { error } = await supabase
      .from("workspace_assignments")
      .update(patch)
      .eq("id", input.assignmentId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("updateAssignmentStatus error:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
