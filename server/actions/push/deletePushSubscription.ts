"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/lib/server/auth";
import { logger } from "@/lib/logger";

export async function deletePushSubscription(endpoint: string): Promise<boolean> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) return false;

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .eq("endpoint", endpoint);

    if (error) {
      logger.error("[Push] deletePushSubscription failed", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("[Push] deletePushSubscription unexpected error", err);
    return false;
  }
}
