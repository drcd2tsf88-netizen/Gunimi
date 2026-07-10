"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type ContactTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  due_date?: string | null;
  created_at: string;
};

export async function getContactTasks(contactId: string): Promise<ContactTask[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, description, status, priority, due_date, created_at")
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getContactTasks error:", error);
      return [];
    }

    return (data || []) as ContactTask[];
  } catch (error) {
    logger.error("getContactTasks failed:", error);
    return [];
  }
}
