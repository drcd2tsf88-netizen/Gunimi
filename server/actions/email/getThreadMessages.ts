"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "@/lib/email/providers";
import { getValidAccessToken } from "@/lib/email/getValidAccessToken";
import { logger } from "@/lib/logger";

export type ThreadMessage = {
  id: string;
  providerMessageId: string;
  senderEmail: string;
  senderName: string | null;
  subject: string | null;
  sentAt: string;
  isOutbound: boolean;
  isUnread: boolean;
  body: string | null;
};

export async function getThreadMessages(threadId: string): Promise<ThreadMessage[]> {
  try {
    const { data: thread } = await supabaseAdmin
      .from("email_threads")
      .select("connection_id")
      .eq("id", threadId)
      .maybeSingle();

    if (!thread?.connection_id) return [];

    const tokenData = await getValidAccessToken(thread.connection_id);
    if (!tokenData) return [];

    const { connection, accessToken } = tokenData;
    const provider = getProvider(connection.provider);

    const { data: messages } = await supabaseAdmin
      .from("email_messages")
      .select("id, provider_message_id, sender_email, sender_name, subject, sent_at, is_outbound, is_unread")
      .eq("thread_id", threadId)
      .order("sent_at", { ascending: true });

    if (!messages || messages.length === 0) return [];

    const result: ThreadMessage[] = await Promise.all(
      messages.map(async (msg) => {
        let body: string | null = null;
        try {
          body = await provider.getMessageBody(accessToken, msg.provider_message_id);
        } catch {
          // body stays null — show snippet fallback in UI
        }
        return {
          id: msg.id,
          providerMessageId: msg.provider_message_id,
          senderEmail: msg.sender_email,
          senderName: msg.sender_name,
          subject: msg.subject,
          sentAt: msg.sent_at,
          isOutbound: msg.is_outbound,
          isUnread: msg.is_unread,
          body,
        };
      })
    );

    return result;
  } catch (err) {
    logger.error("getThreadMessages failed:", err);
    return [];
  }
}
