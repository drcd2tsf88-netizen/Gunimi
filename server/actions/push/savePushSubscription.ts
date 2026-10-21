"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/lib/server/auth";
import { logger } from "@/lib/logger";

export type PushSubscriptionInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function savePushSubscription(input: PushSubscriptionInput): Promise<boolean> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) return false;

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          workspace_id: workspace.id,
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth_key: input.auth,
        },
        { onConflict: "workspace_id,endpoint" },
      );

    if (error) {
      logger.error("[Push] savePushSubscription failed", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("[Push] savePushSubscription unexpected error", err);
    return false;
  }
}
