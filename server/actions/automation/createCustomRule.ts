"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import type {
  AutomationTrigger,
  RuleCondition,
  RuleActionType,
  RuleActionParams,
} from "@/lib/automation/types";

type Payload = {
  name: string;
  trigger: AutomationTrigger;
  conditions: RuleCondition[];
  action_type: RuleActionType;
  action_params: RuleActionParams;
};

export async function createCustomRule(
  payload: Payload
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
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        name: payload.name.trim(),
        trigger: payload.trigger,
        conditions: payload.conditions,
        action_type: payload.action_type,
        action_params: payload.action_params,
        enabled: true,
      });

    if (error) {
      logger.error("createCustomRule failed", error);
      return { success: false, error: "db_error" };
    }

    revalidatePath("/dashboard/automations");
    return { success: true };
  } catch (err) {
    logger.error("createCustomRule unexpected error", err);
    return { success: false, error: "unexpected" };
  }
}
