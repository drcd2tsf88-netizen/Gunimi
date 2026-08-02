"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type WorkspaceWebhook = {
  id: string;
  workspace_id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: string;
};

export async function getWebhooks(): Promise<WorkspaceWebhook[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_webhooks")
      .select("id, workspace_id, url, events, secret, active, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getWebhooks error:", error);
      return [];
    }

    return (data ?? []) as WorkspaceWebhook[];
  } catch (err) {
    logger.error("getWebhooks failed:", err);
    return [];
  }
}
