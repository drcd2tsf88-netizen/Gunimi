"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_orders")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("id", orderId);

    if (error) {
      logger.error(error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function deleteOrderAndRedirect(orderId: string): Promise<void> {
  const ok = await deleteOrder(orderId);
  if (ok) redirect("/dashboard/orders");
}
