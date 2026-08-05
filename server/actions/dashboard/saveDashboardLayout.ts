"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function saveDashboardLayout(
  widgetIds: string[]
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

    const { data: existing } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const currentPrefs =
      typeof existing?.preferences === "object" && existing.preferences !== null
        ? (existing.preferences as Record<string, unknown>)
        : {};

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({
        preferences: { ...currentPrefs, dashboardWidgets: widgetIds },
      })
      .eq("id", workspace.id);

    if (error) {
      logger.error("saveDashboardLayout failed:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    logger.error("saveDashboardLayout exception:", err);
    return { success: false };
  }
}
