import { createClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";
import { logger } from "@/lib/logger";

export type WebhookEvent =
  | "contact.created"
  | "deal.created"
  | "deal.won"
  | "deal.lost"
  | "task.created";

export async function dispatchWebhookEvent(
  workspaceId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient();

    const { data: hooks } = await supabase
      .from("workspace_webhooks")
      .select("url, secret, events")
      .eq("workspace_id", workspaceId)
      .eq("active", true);

    if (!hooks || hooks.length === 0) return;

    const payload = JSON.stringify({
      event,
      workspace_id: workspaceId,
      timestamp: new Date().toISOString(),
      data,
    });

    const deliveries = hooks
      .filter((h) => (h.events as string[]).includes(event))
      .map((hook) => {
        const signature = createHmac("sha256", hook.secret as string)
          .update(payload)
          .digest("hex");

        return fetch(hook.url as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Gunimi-Signature": `sha256=${signature}`,
            "X-Gunimi-Event": event,
          },
          body: payload,
          signal: AbortSignal.timeout(10_000),
        }).catch((err) => {
          logger.error(`Webhook delivery failed for ${hook.url as string}:`, err);
        });
      });

    // Fire-and-forget: do not await
    void Promise.allSettled(deliveries);
  } catch (err) {
    logger.error("dispatchWebhookEvent failed:", err);
  }
}
