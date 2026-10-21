import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendPushNotification } from "./sendPushNotification";
import { logger } from "@/lib/logger";
import type { PushPayload, PushSubscriptionRecord } from "./sendPushNotification";

type SubscriptionRow = PushSubscriptionRecord & { id: string };

export async function notifyWorkspaceMembers(
  workspaceId: string,
  payload: PushPayload,
): Promise<void> {
  const { data: subs, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth_key")
    .eq("workspace_id", workspaceId);

  if (error || !subs?.length) return;

  const expiredIds: string[] = [];

  await Promise.allSettled(
    (subs as SubscriptionRow[]).map(async ({ id, ...sub }) => {
      const result = await sendPushNotification(sub, payload);
      if (result === "expired") expiredIds.push(id);
    }),
  );

  if (expiredIds.length > 0) {
    await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .in("id", expiredIds);

    logger.debug("[Push] Removed expired subscriptions", { count: expiredIds.length, workspaceId });
  }
}
