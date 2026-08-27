"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { revalidatePath } from "next/cache";

export async function setOrderAssignee(
  orderId: string,
  userId: string | null
): Promise<boolean> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    // Cancel all existing person assignments for this order
    await supabase
      .from("workspace_assignments")
      .update({ status: "cancelled", closed_reason: "reassigned" })
      .eq("workspace_id", workspace.id)
      .eq("entity_type", "order")
      .eq("entity_id", orderId)
      .eq("actor_type", "person")
      .not("status", "in", '("completed","cancelled")');

    if (userId) {
      const { error } = await supabase
        .from("workspace_assignments")
        .insert({
          workspace_id: workspace.id,
          entity_type: "order",
          entity_id: orderId,
          actor_type: "person",
          actor_id: userId,
          responsibility: "owner",
          status: "active",
          active_from: new Date().toISOString(),
        });

      if (error) return false;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    return true;
  } catch {
    return false;
  }
}
