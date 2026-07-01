"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { EmailThread } from "@/types/email";

export async function getContactEmails(contactId: string, limit = 8): Promise<EmailThread[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("email_threads")
      .select(
        `id, subject, snippet, message_count, participant_emails, last_message_at, has_unread,
         contact:workspace_contacts(id, name, email),
         company:workspace_companies(id, name)`
      )
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("last_message_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getContactEmails error:", error);
      return [];
    }

    return (data ?? []) as unknown as EmailThread[];
  } catch (error) {
    console.error("getContactEmails failed:", error);
    return [];
  }
}
