"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { randomBytes } from "crypto";
import type { WorkspaceWebhook } from "./getWebhooks";

export async function createWebhook(
  url: string,
  events: string[]
): Promise<{ success: boolean; webhook?: WorkspaceWebhook; error?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthorized" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { success: false, error: "unauthorized" };
    }

    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      return { success: false, error: "invalid_url" };
    }

    if (events.length === 0) {
      return { success: false, error: "no_events" };
    }

    const secret = randomBytes(32).toString("hex");

    const { data, error } = await supabase
      .from("workspace_webhooks")
      .insert({
        workspace_id: workspace.id,
        url,
        events,
        secret,
        active: true,
      })
      .select()
      .single();

    if (error) {
      logger.error("createWebhook error:", error);
      return { success: false, error: "db_error" };
    }

    return { success: true, webhook: data as WorkspaceWebhook };
  } catch (err) {
    logger.error("createWebhook failed:", err);
    return { success: false, error: "unexpected" };
  }
}
