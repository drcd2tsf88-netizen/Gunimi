"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { createHmac } from "crypto";

export async function testWebhook(
  id: string
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthorized" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    const supabase = await createClient();

    const { data: webhook } = await supabase
      .from("workspace_webhooks")
      .select("url, secret")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!webhook) return { success: false, error: "not_found" };

    const payload = JSON.stringify({
      event: "webhook.test",
      workspace_id: workspace.id,
      timestamp: new Date().toISOString(),
      data: { message: "This is a test delivery from Gunimi." },
    });

    const signature = createHmac("sha256", webhook.secret)
      .update(payload)
      .digest("hex");

    const res = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gunimi-Signature": `sha256=${signature}`,
        "X-Gunimi-Event": "webhook.test",
      },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });

    return { success: res.ok, statusCode: res.status };
  } catch (err) {
    logger.error("testWebhook failed:", err);
    return { success: false, error: "delivery_failed" };
  }
}
