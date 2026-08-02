"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function toggleWebhook(
  id: string,
  active: boolean
): Promise<{ success: boolean }> {
  try {
    const user = await getUser();
    if (!user) return { success: false };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false };

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { success: false };
    }

    const { error } = await supabase
      .from("workspace_webhooks")
      .update({ active })
      .eq("id", id)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("toggleWebhook error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    logger.error("toggleWebhook failed:", err);
    return { success: false };
  }
}
