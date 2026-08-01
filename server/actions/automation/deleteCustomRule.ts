"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function deleteCustomRule(
  ruleId: string
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

    const { error } = await supabase
      .from("workspace_automation_rules")
      .delete()
      .eq("id", ruleId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteCustomRule failed", error);
      return { success: false, error: "db_error" };
    }

    revalidatePath("/dashboard/automations");
    return { success: true };
  } catch (err) {
    logger.error("deleteCustomRule unexpected error", err);
    return { success: false, error: "unexpected" };
  }
}
