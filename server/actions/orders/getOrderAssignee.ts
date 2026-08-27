"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type OrderAssignee = {
  assignmentId: string;
  userId: string;
  name: string | null;
  email: string;
};

export async function getOrderAssignee(orderId: string): Promise<OrderAssignee | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data } = await supabase
      .from("workspace_assignments")
      .select("id, actor_id")
      .eq("workspace_id", workspace.id)
      .eq("entity_type", "order")
      .eq("entity_id", orderId)
      .eq("actor_type", "person")
      .not("status", "in", '("completed","cancelled")')
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", data.actor_id)
      .maybeSingle();

    if (!profile) return null;

    return {
      assignmentId: data.id,
      userId: data.actor_id,
      name: profile.full_name,
      email: profile.email,
    };
  } catch {
    return null;
  }
}
