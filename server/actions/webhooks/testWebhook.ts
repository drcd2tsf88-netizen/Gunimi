"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { createHmac } from "crypto";
import { validateWebhookUrl } from "@/lib/webhooks/validateUrl";

export async function testWebhook(
  id: string
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
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

    const { data: webhook } = await supabase
      .from("workspace_webhooks")
      .select("url, secret")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!webhook) return { success: false, error: "not_found" };

    const urlCheck = validateWebhookUrl(webhook.url as string);
    if (!urlCheck.valid) {
      return { success: false, error: "invalid_url" };
    }

    const payload = JSON.stringify({
      event: "webhook.test",
      workspace_id: workspace.id,
      timestamp: new Date().toISOString(),
      data: { message: "This is a test delivery from Gunimi." },
    });

    const signature = createHmac("sha256", webhook.secret as string)
      .update(payload)
      .digest("hex");

    const res = await fetch(webhook.url as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gunimi-Signature": `sha256=${signature}`,
        "X-Gunimi-Event": "webhook.test",
      },
      body: payload,
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });

    return { success: res.ok, statusCode: res.status };
  } catch (err) {
    logger.error("testWebhook failed:", err);
    return { success: false, error: "delivery_failed" };
  }
}
