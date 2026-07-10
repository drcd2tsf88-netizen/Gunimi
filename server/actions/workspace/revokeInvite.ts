"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export async function revokeInvite(inviteId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    // Verify caller has permission (owner or admin)
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return false;
    }

    // Use supabaseAdmin — the user-client UPDATE is blocked by invites_update_email_match RLS
    const { error, count } = await supabaseAdmin
      .from("workspace_invites")
      .update({ status: "revoked" }, { count: "exact" })
      .eq("id", inviteId)
      .eq("workspace_id", workspace.id)
      .eq("status", "pending");

    if (error) {
      logger.error("revokeInvite error:", error);
      return false;
    }

    if (!count || count === 0) {
      logger.error("revokeInvite: no rows updated for invite", inviteId);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
