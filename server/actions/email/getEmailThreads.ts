"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { EmailThread } from "@/types/email";
import { logger } from "@/lib/logger";

export async function getEmailThreads(limit = 50): Promise<EmailThread[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("email_threads")
      .select(
        `id, subject, snippet, message_count, participant_emails, last_message_at, has_unread,
         connection:email_connections(provider),
         contact:workspace_people(id, name, email),
         company:workspace_companies(id, name)`
      )
      .eq("workspace_id", workspace.id)
      .order("last_message_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("getEmailThreads error:", error);
      return [];
    }

    type RawRow = {
      connection: Array<{ provider: string }> | { provider: string } | null;
      [key: string]: unknown;
    };
    return (data ?? []).map((row) => {
      const r = row as RawRow;
      const conn = Array.isArray(r.connection) ? r.connection[0] : r.connection;
      const { connection: _c, ...rest } = r;
      return { ...rest, provider: conn?.provider ?? null } as unknown as EmailThread;
    });
  } catch (error) {
    logger.error("getEmailThreads failed:", error);
    return [];
  }
}
