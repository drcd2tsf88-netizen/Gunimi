"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type DealRelatedTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  due_date?: string | null;
  created_at: string;
};

export async function getDealRelatedTasks(
  contactId?: string | null
): Promise<DealRelatedTask[]> {
  if (!contactId) return [];

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, description, status, priority, due_date, created_at")
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("getDealRelatedTasks error:", error);
      return [];
    }

    return (data || []) as DealRelatedTask[];
  } catch (error) {
    console.error("getDealRelatedTasks failed:", error);
    return [];
  }
}
