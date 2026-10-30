import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { detectOrderIntent } from "./detectOrderIntent";
import { produceSignal } from "@/lib/signals/engine";
import { getTierFromPreferences, TIER_LIMITS } from "@/lib/ai/tiers";

const LOOKBACK_MINUTES = 30;

export async function processEmailOrderIntents(
  workspaceId: string,
  userId: string,
  connectionId: string,
): Promise<{ signalsProduced: number }> {
  const since = new Date(Date.now() - LOOKBACK_MINUTES * 60 * 1000).toISOString();

  // Scan recent inbound (not outbound) messages only
  const { data: messages } = await supabaseAdmin
    .from("email_messages")
    .select("provider_message_id, subject, snippet, thread_id")
    .eq("connection_id", connectionId)
    .eq("is_outbound", false)
    .gte("updated_at", since)
    .not("snippet", "is", null);

  if (!messages || messages.length === 0) return { signalsProduced: 0 };

  const { data: workspaceRow } = await supabaseAdmin
    .from("workspaces")
    .select("preferences")
    .eq("id", workspaceId)
    .maybeSingle();

  const tier = getTierFromPreferences(workspaceRow?.preferences as Record<string, unknown> | null);
  const cappedMessages = messages.slice(0, TIER_LIMITS[tier].maxPromiseEmailsPerRun);

  let signalsProduced = 0;

  for (const msg of cappedMessages) {
    if (!msg.snippet) continue;

    // Skip if already produced a signal for this message (dedup by origin)
    const msgOrigin = `email_engine:${msg.provider_message_id}`;
    const { count } = await supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("type", "email_order_intent")
      .eq("origin", msgOrigin)
      .not("state", "in", '("resolved","archived")');

    if ((count ?? 0) > 0) continue;

    // Resolve contact from thread CRM link
    const { data: thread } = await supabaseAdmin
      .from("email_threads")
      .select("id, contact_id")
      .eq("id", msg.thread_id)
      .maybeSingle();

    let intent;
    try {
      intent = await detectOrderIntent(workspaceId, userId, msg.subject ?? "", msg.snippet);
    } catch (err) {
      logger.error("[OrderIntent] AI detection failed", {
        messageId: msg.provider_message_id,
        error: err instanceof Error ? err.message : "Unknown",
      });
      continue;
    }

    if (!intent.detected) continue;

    const produced = await produceSignal({
      workspaceId,
      entityType: "email",
      entityId: thread?.id ?? msg.thread_id,
      type: "email_order_intent",
      confidence: intent.confidence,
      evidenceData: {
        subject: (msg.subject ?? "").slice(0, 100),
        summary: (intent.summary ?? "").slice(0, 200),
        threadId: thread?.id ?? msg.thread_id,
        contactId: thread?.contact_id ?? "",
        messageId: msg.provider_message_id,
      },
      producedBy: "email_engine",
      origin: msgOrigin,
    });

    if (produced) signalsProduced++;
  }

  return { signalsProduced };
}
