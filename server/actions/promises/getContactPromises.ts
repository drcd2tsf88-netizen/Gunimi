"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type ContactPromise = {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  created_at: string;
};

const PROMISE_MARKER = "<!-- pid:";

export async function getContactPromises(contactId: string): Promise<ContactPromise[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, status, due_date, created_at")
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .ilike("description", `${PROMISE_MARKER}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      logger.error("getContactPromises error:", error);
      return [];
    }

    return (data ?? []) as ContactPromise[];
  } catch {
    return [];
  }
}
