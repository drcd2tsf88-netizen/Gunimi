"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "@/lib/email/providers";
import { getValidAccessToken } from "@/lib/email/getValidAccessToken";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

type ReplyResult = { ok: true; messageId: string } | { ok: false; error: string };

export async function replyToThread(
  threadId: string,
  body: string
): Promise<ReplyResult> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) return { ok: false, error: "unauthorized" };

    const { data: thread } = await supabaseAdmin
      .from("email_threads")
      .select("connection_id, subject, provider_thread_id, contact_id, participant_emails")
      .eq("id", threadId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!thread) return { ok: false, error: "thread_not_found" };

    const tokenData = await getValidAccessToken(thread.connection_id);
    if (!tokenData) return { ok: false, error: "no_token" };

    const { connection, accessToken } = tokenData;

    // Scope check — must have send scope
    if (!connection.scope?.includes("gmail.send")) {
      return { ok: false, error: "reconnect_required" };
    }

    const provider = getProvider(connection.provider);

    const subject = thread.subject
      ? thread.subject.startsWith("Re:") ? thread.subject : `Re: ${thread.subject}`
      : "Re: (no subject)";

    // Reply to all participants except ourselves
    const participants: string[] = thread.participant_emails ?? [];
    const ownEmail = connection.provider_account_email.toLowerCase();
    const recipients = participants.filter((e: string) => e.toLowerCase() !== ownEmail);
    const to = recipients.length > 0 ? recipients.join(", ") : ownEmail;

    const providerMessageId = await provider.sendMessage(accessToken, {
      from: connection.provider_account_email,
      to,
      subject,
      body,
      threadId: thread.provider_thread_id,
    });

    // Trigger relationship signal if thread is linked to a contact
    if (thread.contact_id) {
      void supabaseAdmin.from("signals").insert({
        workspace_id: workspace.id,
        type: "email_sent",
        entity_type: "contact",
        entity_id: thread.contact_id,
        title: `Email sent: ${subject}`,
        status: "active",
        priority: "low",
      });
    }

    return { ok: true, messageId: providerMessageId };
  } catch (err) {
    logger.error("replyToThread failed:", err);
    return { ok: false, error: "unknown" };
  }
}
