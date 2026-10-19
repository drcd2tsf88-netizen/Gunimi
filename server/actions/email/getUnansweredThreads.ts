"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type UnansweredThread = {
  id: string;
  subject: string | null;
  snippet: string | null;
  last_message_at: string | null;
  provider_thread_id: string;
  provider: "gmail" | "microsoft365";
  provider_account_email: string;
  contact: { id: string; name: string; email: string | null } | null;
  company: { id: string; name: string } | null;
  sender_name: string | null;
  sender_email: string;
};

export async function getUnansweredThreads(limit = 8): Promise<UnansweredThread[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: threads, error: threadsError } = await supabaseAdmin
      .from("email_threads")
      .select(`
        id, subject, snippet, last_message_at, provider_thread_id,
        connection:email_connections!connection_id(provider, provider_account_email),
        contact:workspace_people!contact_id(id, name, email),
        company:workspace_companies!company_id(id, name)
      `)
      .eq("workspace_id", workspace.id)
      .gte("last_message_at", thirtyDaysAgo)
      .order("last_message_at", { ascending: false })
      .limit(80);

    if (threadsError || !threads?.length) return [];

    const threadIds = threads.map((t) => t.id);

    // One query for all last messages — ordered DESC so first hit per thread is the latest
    const { data: messages, error: msgsError } = await supabaseAdmin
      .from("email_messages")
      .select("thread_id, is_outbound, sender_name, sender_email")
      .in("thread_id", threadIds)
      .order("sent_at", { ascending: false });

    if (msgsError) {
      logger.error("getUnansweredThreads: messages query failed", msgsError);
      return [];
    }

    // Map thread_id → last message (first occurrence = most recent due to ORDER BY DESC)
    const lastMsgMap = new Map<string, { is_outbound: boolean; sender_name: string | null; sender_email: string }>();
    for (const msg of messages ?? []) {
      if (!lastMsgMap.has(msg.thread_id)) {
        lastMsgMap.set(msg.thread_id, {
          is_outbound: msg.is_outbound,
          sender_name: msg.sender_name,
          sender_email: msg.sender_email,
        });
      }
    }

    const result: UnansweredThread[] = [];

    for (const thread of threads) {
      if (result.length >= limit) break;

      const last = lastMsgMap.get(thread.id);
      if (!last || last.is_outbound) continue;

      const conn = (thread.connection as unknown) as { provider: "gmail" | "microsoft365"; provider_account_email: string } | null;
      if (!conn) continue;

      result.push({
        id: thread.id,
        subject: thread.subject ?? null,
        snippet: thread.snippet ?? null,
        last_message_at: thread.last_message_at ?? null,
        provider_thread_id: thread.provider_thread_id,
        provider: conn.provider,
        provider_account_email: conn.provider_account_email,
        contact: (thread.contact as unknown) as UnansweredThread["contact"],
        company: (thread.company as unknown) as UnansweredThread["company"],
        sender_name: last.sender_name,
        sender_email: last.sender_email,
      });
    }

    return result;
  } catch (error) {
    logger.error("getUnansweredThreads failed", error);
    return [];
  }
}
