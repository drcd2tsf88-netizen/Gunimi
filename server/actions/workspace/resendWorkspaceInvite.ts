"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendWorkspaceInvite } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function resendWorkspaceInvite(inviteId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit()) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) return false;

    const { data: invite } = await supabaseAdmin
      .from("workspace_invites")
      .select("id, email, role, status")
      .eq("id", inviteId)
      .eq("workspace_id", workspace.id)
      .eq("status", "pending")
      .maybeSingle();

    if (!invite) return false;

    const newToken = crypto.randomUUID();
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const { error } = await supabaseAdmin
      .from("workspace_invites")
      .update({ token: newToken, expires_at: newExpiresAt.toISOString() })
      .eq("id", inviteId)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("resendWorkspaceInvite: update failed", error);
      return false;
    }

    try {
      await sendWorkspaceInvite({
        email: invite.email,
        workspaceName: workspace.name,
        role: invite.role as "admin" | "member",
        token: newToken,
      });
    } catch (emailErr) {
      logger.error("resendWorkspaceInvite: email send failed", emailErr);
    }

    return true;
  } catch {
    return false;
  }
}
