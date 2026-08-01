"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export async function toggleAutomation(
  ruleId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthenticated" };

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

    const { data: ws } = await supabaseAdmin
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const prefs = (ws?.preferences as Record<string, unknown>) ?? {};
    const disabled: string[] = Array.isArray(prefs.disabledAutomations)
      ? (prefs.disabledAutomations as string[])
      : [];

    const newDisabled = enabled
      ? disabled.filter((id) => id !== ruleId)
      : disabled.includes(ruleId)
        ? disabled
        : [...disabled, ruleId];

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({ preferences: { ...prefs, disabledAutomations: newDisabled } })
      .eq("id", workspace.id);

    if (error) {
      logger.error("toggleAutomation failed", error);
      return { success: false, error: "db_error" };
    }

    revalidatePath("/dashboard/automations");
    return { success: true };
  } catch (err) {
    logger.error("toggleAutomation unexpected error", err);
    return { success: false, error: "unexpected" };
  }
}
