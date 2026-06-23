import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "./providers";
import { linkThreadToCrm } from "./crm-linker";

const THREAD_BATCH_SIZE = 10;

function isRevokedTokenError(err: unknown): boolean {
  return String(err).includes("invalid_grant");
}

export async function syncEmailConnection(
  connectionId: string
): Promise<{ synced: number; linked: number }> {
  const { data: connection, error: connError } = await supabaseAdmin
    .from("email_connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (connError || !connection) {
    throw new Error(`Email connection not found: ${connectionId}`);
  }

  const provider = getProvider(connection.provider);

  // Refresh token if expiring within 60 seconds
  let accessToken: string = connection.access_token;
  if (
    connection.token_expires_at &&
    new Date(connection.token_expires_at).getTime() < Date.now() + 60_000
  ) {
    if (!connection.refresh_token) {
      throw new Error(`No refresh token for connection ${connectionId}`);
    }

    try {
      const refreshed = await provider.refreshAccessToken(connection.refresh_token);
      accessToken = refreshed.accessToken;

      await supabaseAdmin
        .from("email_connections")
        .update({
          access_token: refreshed.accessToken,
          token_expires_at: refreshed.expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);
    } catch (refreshError) {
      if (isRevokedTokenError(refreshError)) {
        console.error(
          `[Email] Token revoked for connection ${connectionId} — clearing credentials`
        );
        await supabaseAdmin
          .from("email_connections")
          .update({
            access_token: null,
            refresh_token: null,
            token_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", connectionId);
      }
      throw refreshError;
    }
  }

  // List recent threads
  const summaries = await provider.listThreads(accessToken, { maxResults: 30 });

  if (summaries.length === 0) {
    await supabaseAdmin
      .from("email_connections")
      .update({ last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", connectionId);
    return { synced: 0, linked: 0 };
  }

  let synced = 0;
  let linked = 0;

  // Fetch thread details in batches of THREAD_BATCH_SIZE
  for (let i = 0; i < summaries.length; i += THREAD_BATCH_SIZE) {
    const batch = summaries.slice(i, i + THREAD_BATCH_SIZE);

    const details = await Promise.all(
      batch.map((s) =>
        provider.getThreadDetail(accessToken, s.providerThreadId).catch(() => null)
      )
    );

    for (const detail of details) {
      if (!detail) continue;

      const msgs = detail.messages;
      if (msgs.length === 0) continue;

      const allEmails = Array.from(
        new Set([
          ...msgs.map((m) => m.senderEmail),
          ...msgs.flatMap((m) => [...m.recipientEmails, ...m.ccEmails]),
        ])
      ).filter(Boolean);

      const hasUnread = msgs.some((m) => m.isUnread);

      const threadRow = {
        workspace_id: connection.workspace_id,
        connection_id: connectionId,
        provider_thread_id: detail.providerThreadId,
        subject: detail.subject ?? null,
        snippet: detail.snippet ?? null,
        message_count: msgs.length,
        participant_emails: allEmails,
        last_message_at: detail.lastMessageAt?.toISOString() ?? null,
        has_unread: hasUnread,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: upsertedThread, error: threadError } = await supabaseAdmin
        .from("email_threads")
        .upsert(threadRow, { onConflict: "connection_id,provider_thread_id" })
        .select("id")
        .single();

      if (threadError || !upsertedThread) {
        console.error("Failed to upsert thread:", detail.providerThreadId, threadError);
        continue;
      }

      const threadId = upsertedThread.id;

      // Upsert individual messages
      const messageRows = msgs.map((msg) => ({
        workspace_id: connection.workspace_id,
        thread_id: threadId,
        connection_id: connectionId,
        provider_message_id: msg.providerMessageId,
        sender_email: msg.senderEmail,
        sender_name: msg.senderName ?? null,
        recipient_emails: msg.recipientEmails,
        cc_emails: msg.ccEmails,
        subject: msg.subject ?? null,
        snippet: msg.snippet ?? null,
        sent_at: msg.sentAt.toISOString(),
        is_outbound: msg.senderEmail === connection.provider_account_email,
        is_unread: msg.isUnread,
        updated_at: new Date().toISOString(),
      }));

      if (messageRows.length > 0) {
        const { error: msgError } = await supabaseAdmin
          .from("email_messages")
          .upsert(messageRows, { onConflict: "connection_id,provider_message_id" });

        if (msgError) {
          console.error("Failed to upsert messages for thread:", threadId, msgError);
        }
      }

      // CRM linking
      const { contactId, companyId } = await linkThreadToCrm(
        connection.workspace_id,
        threadId,
        allEmails
      );

      if (contactId || companyId) linked++;
      synced++;
    }
  }

  await supabaseAdmin
    .from("email_connections")
    .update({ last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", connectionId);

  return { synced, linked };
}
