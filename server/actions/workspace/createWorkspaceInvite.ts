"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendWorkspaceInvite } from "@/lib/email";

const ALLOWED_ROLES = ["admin", "member"] as const;
type InviteRole = (typeof ALLOWED_ROLES)[number];

type CreateWorkspaceInviteProps = {
  email: string;
  role?: InviteRole;
};

type InviteResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "no_workspace" | "forbidden" | "invalid_role" | "already_member" | "already_invited" | "db_error" | "unknown" };

export async function createWorkspaceInvite({
  email,
  role = "member",
}: CreateWorkspaceInviteProps): Promise<InviteResult> {
  try {
    const user = await getUser();
    if (!user) return { ok: false, error: "unauthorized" };
    if (!await checkWriteRateLimit(user.id)) return { ok: false, error: "unauthorized" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { ok: false, error: "no_workspace" };

    if (!ALLOWED_ROLES.includes(role as InviteRole)) {
      return { ok: false, error: "invalid_role" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = await createClient();

    // Verify caller is owner or admin
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { ok: false, error: "forbidden" };
    }

    // Check for duplicate pending invite
    const { data: existingInvite } = await supabase
      .from("workspace_invites")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("email", normalizedEmail)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInvite) return { ok: false, error: "already_invited" };

    // Check if the person is already a workspace member
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingProfile) {
      const { data: existingMembership } = await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", workspace.id)
        .eq("user_id", existingProfile.id)
        .maybeSingle();

      if (existingMembership) return { ok: false, error: "already_member" };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const { error: insertError } = await supabase
      .from("workspace_invites")
      .insert({
        workspace_id: workspace.id,
        invited_by: user.id,
        email: normalizedEmail,
        role,
        token,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("createWorkspaceInvite: insert failed", insertError);
      return { ok: false, error: "db_error" };
    }

    // Send email — non-fatal
    try {
      await sendWorkspaceInvite({
        email: normalizedEmail,
        workspaceName: workspace.name,
        role,
        token,
      });
    } catch (emailErr) {
      console.error("createWorkspaceInvite: email send failed", emailErr);
    }

    // Activity log — non-fatal
    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "invite_sent",
        title: "Invitation Sent",
        description: `Invited ${normalizedEmail} as ${role}`,
      });

    return { ok: true };
  } catch (error) {
    console.error("createWorkspaceInvite failed:", error);
    return { ok: false, error: "unknown" };
  }
}
