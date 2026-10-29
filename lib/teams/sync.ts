import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { decryptToken, encryptToken } from "@/lib/server/crypto";
import { logger } from "@/lib/logger";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0/me";
const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

type GraphChatMember = {
  id: string;
  displayName: string | null;
  email: string | null;
  userId?: string;
};

type GraphChat = {
  id: string;
  chatType: "oneOnOne" | "group" | "meeting";
  topic: string | null;
  lastUpdatedDateTime: string | null;
  members?: GraphChatMember[];
};

type GraphMessage = {
  id: string;
  messageType: string;
  createdDateTime: string;
  from: {
    user?: {
      id: string;
      displayName: string | null;
    };
  } | null;
  body: { contentType: string; content: string };
};

async function refreshTokenIfNeeded(connection: Record<string, unknown>): Promise<string> {
  let accessToken = decryptToken(connection.access_token as string);
  const expiresAt = connection.token_expires_at as string | null;

  if (expiresAt && new Date(expiresAt).getTime() < Date.now() + 60_000) {
    if (!connection.refresh_token) throw new Error("No refresh token");
    const res = await fetch(MS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: decryptToken(connection.refresh_token as string),
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        grant_type: "refresh_token",
      }).toString(),
    });
    if (!res.ok) throw new Error("Token refresh failed");
    const data = await res.json();
    accessToken = data.access_token;
    await supabaseAdmin
      .from("email_connections")
      .update({
        access_token: encryptToken(accessToken),
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id as string);
  }

  return accessToken;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchChats(accessToken: string): Promise<GraphChat[]> {
  const params = new URLSearchParams({
    $expand: "members",
    $top: "50",
    $orderby: "lastUpdatedDateTime desc",
  });
  const res = await fetch(`${GRAPH_BASE}/chats?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Teams chats fetch failed: ${text}`);
  }
  const data = await res.json();
  return (data.value ?? []) as GraphChat[];
}

async function fetchChatMessages(accessToken: string, chatId: string): Promise<GraphMessage[]> {
  const params = new URLSearchParams({ $top: "20", $orderby: "createdDateTime desc" });
  const res = await fetch(`${GRAPH_BASE}/chats/${chatId}/messages?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return ((data.value ?? []) as GraphMessage[]).filter(
    (m) => m.messageType === "message" && m.from?.user
  );
}

async function linkToCrm(
  workspaceId: string,
  threadId: string,
  participantEmails: string[]
): Promise<void> {
  if (participantEmails.length === 0) return;

  const { data: people } = await supabaseAdmin
    .from("workspace_people")
    .select("id, company_id, email")
    .eq("workspace_id", workspaceId)
    .in("email", participantEmails);

  if (!people?.length) return;

  const person = people[0];
  await supabaseAdmin
    .from("communication_threads")
    .update({
      contact_id: person.id,
      company_id: person.company_id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", threadId);
}

export async function syncTeamsChats(
  connectionId: string
): Promise<{ synced: number; linked: number; needsPermission?: boolean }> {
  const { data: connection, error } = await supabaseAdmin
    .from("email_connections")
    .select("*")
    .eq("id", connectionId)
    .maybeSingle();

  if (error || !connection) throw new Error(`Connection not found: ${connectionId}`);
  if (connection.provider !== "microsoft365") throw new Error("Not a Microsoft 365 connection");

  const workspaceId = connection.workspace_id as string;
  const accessToken = await refreshTokenIfNeeded(connection);

  let chats: GraphChat[];
  try {
    chats = await fetchChats(accessToken);
  } catch (err) {
    // 403 = Chat.Read permission not granted — not an error worth logging loudly
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("403") || message.includes("Forbidden") || message.includes("Authorization")) {
      return { synced: 0, linked: 0, needsPermission: true };
    }
    logger.error("[Teams] Failed to fetch chats", err);
    return { synced: 0, linked: 0 };
  }

  let synced = 0;
  let linked = 0;

  for (const chat of chats) {
    try {
      const members: GraphChatMember[] = chat.members ?? [];
      const myEmail = (connection.provider_account_email as string).toLowerCase();

      const participantEmails = members
        .filter((m) => m.email && m.email.toLowerCase() !== myEmail)
        .map((m) => m.email!.toLowerCase());

      // Build userId→email map for message sender resolution
      const userEmailMap = new Map<string, string>();
      for (const m of members) {
        if (m.userId && m.email) userEmailMap.set(m.userId, m.email.toLowerCase());
      }

      // Display name: topic for group, other person's name for 1:1
      let displayName: string | null = chat.topic ?? null;
      if (!displayName && chat.chatType === "oneOnOne") {
        const other = members.find((m) => m.email?.toLowerCase() !== myEmail);
        displayName = other?.displayName ?? null;
      }

      // Fetch messages
      const messages = await fetchChatMessages(accessToken, chat.id);
      const lastMessage = messages[0];
      const snippet = lastMessage
        ? stripHtml(lastMessage.body.content).slice(0, 200)
        : null;
      const lastMessageAt = lastMessage?.createdDateTime ?? chat.lastUpdatedDateTime ?? null;

      // Upsert thread
      const { data: thread } = await supabaseAdmin
        .from("communication_threads")
        .upsert(
          {
            workspace_id: workspaceId,
            connection_id: connectionId,
            channel: "teams",
            provider_thread_id: chat.id,
            chat_type: chat.chatType,
            display_name: displayName,
            snippet,
            participant_emails: participantEmails,
            message_count: messages.length,
            last_message_at: lastMessageAt,
            has_unread: false,
            updated_at: new Date().toISOString(),
            synced_at: new Date().toISOString(),
          },
          { onConflict: "connection_id,provider_thread_id" }
        )
        .select("id, contact_id")
        .single();

      if (!thread) continue;
      synced++;

      // Upsert messages (most recent 20)
      const messageRows = messages.map((msg) => {
        const senderUserId = msg.from?.user?.id ?? "";
        const senderEmail = userEmailMap.get(senderUserId) ?? null;
        const isOutbound = senderEmail === myEmail;
        return {
          workspace_id: workspaceId,
          thread_id: thread.id,
          provider_message_id: msg.id,
          sender_email: senderEmail,
          sender_name: msg.from?.user?.displayName ?? null,
          body: stripHtml(msg.body.content).slice(0, 2000),
          sent_at: msg.createdDateTime,
          is_outbound: isOutbound,
        };
      });

      if (messageRows.length > 0) {
        await supabaseAdmin
          .from("communication_messages")
          .upsert(messageRows, { onConflict: "thread_id,provider_message_id" });
      }

      // CRM link if not already linked
      if (!thread.contact_id && participantEmails.length > 0) {
        await linkToCrm(workspaceId, thread.id, participantEmails);
        linked++;
      }
    } catch (chatErr) {
      logger.error(`[Teams] Failed to sync chat ${chat.id}`, chatErr);
    }
  }

  await supabaseAdmin
    .from("email_connections")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", connectionId);

  return { synced, linked };
}
