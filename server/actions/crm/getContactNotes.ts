"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type ContactNote = {
  id: string;
  title: string;
  content?: string | null;
  created_at: string;
};

export async function getContactNotes(contactId: string): Promise<ContactNote[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_notes")
      .select("id, title, content, created_at")
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getContactNotes error:", error);
      return [];
    }

    return (data || []) as ContactNote[];
  } catch (error) {
    logger.error("getContactNotes failed:", error);
    return [];
  }
}
