"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

type LeaveResult = { ok: boolean; error?: string };

export async function leaveWorkspace(): Promise<LeaveResult> {
  try {
    const user = await getUser();
    if (!user) return { ok: false, error: "unauthorized" };
    if (!await checkWriteRateLimit(user.id)) return { ok: false, error: "unauthorized" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { ok: false, error: "no_workspace" };

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) return { ok: false, error: "not_member" };

    if (membership.role === "owner") {
      return { ok: false, error: "owner_cannot_leave" };
    }

    const { error, count } = await supabaseAdmin
      .from("workspace_members")
      .delete({ count: "exact" })
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id);

    if (error) {
      logger.error(error);
      return { ok: false, error: "db_error" };
    }

    if (!count || count === 0) {
      logger.error("leaveWorkspace: no membership row deleted for user", user.id);
      return { ok: false, error: "not_deleted" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
