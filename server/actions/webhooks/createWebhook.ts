"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { randomBytes } from "crypto";
import { validateWebhookUrl } from "@/lib/webhooks/validateUrl";
import type { WorkspaceWebhook } from "./getWebhooks";

const ALLOWED_EVENTS = new Set([
  "contact.created",
  "deal.created",
  "deal.won",
  "deal.lost",
  "task.created",
]);

export type CreateWebhookResult =
  | { success: false; error: string }
  | { success: true; webhook: WorkspaceWebhook; plainSecret: string };

export async function createWebhook(
  url: string,
  events: string[]
): Promise<CreateWebhookResult> {
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

    const urlCheck = validateWebhookUrl(url.trim());
    if (!urlCheck.valid) {
      return { success: false, error: urlCheck.reason };
    }

    if (events.length === 0) {
      return { success: false, error: "no_events" };
    }

    const invalidEvent = events.find((e) => !ALLOWED_EVENTS.has(e));
    if (invalidEvent) {
      return { success: false, error: "invalid_event" };
    }

    const plainSecret = randomBytes(32).toString("hex");

    const { data, error } = await supabase
      .from("workspace_webhooks")
      .insert({
        workspace_id: workspace.id,
        url: url.trim(),
        events,
        secret: plainSecret,
        active: true,
      })
      .select("id, workspace_id, url, events, active, created_at")
      .single();

    if (error) {
      logger.error("createWebhook error:", error);
      return { success: false, error: "db_error" };
    }

    return {
      success: true,
      webhook: data as WorkspaceWebhook,
      plainSecret,
    };
  } catch (err) {
    logger.error("createWebhook failed:", err);
    return { success: false, error: "unexpected" };
  }
}
