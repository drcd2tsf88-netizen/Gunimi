"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

const MIN_LIMIT = 10_000;
const MAX_LIMIT = 1_000_000;

export async function updateWorkspaceAILimit(limit: number): Promise<boolean> {
  try {
    if (!Number.isInteger(limit) || limit < MIN_LIMIT || limit > MAX_LIMIT) return false;

    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership?.role !== "owner") return false;

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({ ai_daily_token_limit: limit })
      .eq("id", workspace.id);

    if (error) {
      logger.error("updateWorkspaceAILimit failed", error);
      return false;
    }

    revalidatePath("/dashboard/settings");
    return true;
  } catch (err) {
    logger.error("updateWorkspaceAILimit unexpected error", err);
    return false;
  }
}
