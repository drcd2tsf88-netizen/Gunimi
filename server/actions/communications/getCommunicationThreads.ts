"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { CommunicationThread } from "@/types/communications";

export async function getCommunicationThreads(limit = 50): Promise<CommunicationThread[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("communication_threads")
      .select(
        `id, workspace_id, connection_id, channel, provider_thread_id, chat_type,
         display_name, snippet, participant_emails, message_count, last_message_at, has_unread,
         contact:workspace_people(id, name, email),
         company:workspace_companies(id, name)`
      )
      .eq("workspace_id", workspace.id)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      logger.error("getCommunicationThreads error:", error);
      return [];
    }

    return (data ?? []) as unknown as CommunicationThread[];
  } catch (err) {
    logger.error("getCommunicationThreads failed:", err);
    return [];
  }
}

export async function getCommunicationMessages(
  threadId: string
): Promise<
  Array<{
    id: string;
    provider_message_id: string;
    sender_email: string | null;
    sender_name: string | null;
    body: string | null;
    sent_at: string;
    is_outbound: boolean;
  }>
> {
  try {
    const { data, error } = await supabaseAdmin
      .from("communication_messages")
      .select("id, provider_message_id, sender_email, sender_name, body, sent_at, is_outbound")
      .eq("thread_id", threadId)
      .order("sent_at", { ascending: true })
      .limit(50);

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
