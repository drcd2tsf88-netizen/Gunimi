"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { WorkspaceActivity } from "@/types/activity";
import { logger } from "@/lib/logger";

export async function getContactActivity(contactId: string): Promise<WorkspaceActivity[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_activity")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      logger.error("getContactActivity error:", error);
      return [];
    }

    return (data || []) as unknown as WorkspaceActivity[];
  } catch (error) {
    logger.error("getContactActivity failed:", error);
    return [];
  }
}
