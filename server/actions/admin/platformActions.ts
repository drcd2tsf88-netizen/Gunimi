"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { logAuditEvent } from "@/lib/admin/logAuditEvent";

async function getAdminActor(): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.platform_role === "admin" ? { id: user.id } : null;
}

export async function suspendWorkspace(
  workspaceId: string,
  suspended: boolean
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminActor();
  if (!admin) return { success: false, error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("workspaces")
    .update({ is_suspended: suspended })
    .eq("id", workspaceId);

  if (error) return { success: false, error: error.message };

  void logAuditEvent({
    actorId: admin.id,
    action: suspended ? "workspace.suspend" : "workspace.resume",
    entityType: "workspace",
    entityId: workspaceId,
    workspaceId,
  });
  revalidatePath("/dashboard/admin/workspaces");
  return { success: true };
}

export async function setUserPlatformRole(
  userId: string,
  role: "admin" | "team" | null
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminActor();
  if (!admin) return { success: false, error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ platform_role: role })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  void logAuditEvent({
    actorId: admin.id,
    action: "user.set_platform_role",
    entityType: "user",
    entityId: userId,
    metadata: { role },
  });
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function setWorkspaceFeatureFlag(
  workspaceId: string,
  flag: string,
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminActor();
  if (!admin) return { success: false, error: "Unauthorized" };

  const { data: ws } = await supabaseAdmin
    .from("workspaces")
    .select("feature_flags")
    .eq("id", workspaceId)
    .maybeSingle();

  const current = (ws?.feature_flags as Record<string, boolean>) ?? {};
  const updated = { ...current, [flag]: value };

  const { error } = await supabaseAdmin
    .from("workspaces")
    .update({ feature_flags: updated })
    .eq("id", workspaceId);

  if (error) return { success: false, error: error.message };

  void logAuditEvent({
    actorId: admin.id,
    action: "workspace.feature_flag",
    entityType: "workspace",
    entityId: workspaceId,
    workspaceId,
    metadata: { flag, value },
  });
  revalidatePath("/dashboard/admin/workspaces");
  return { success: true };
}

export async function adminRevokeInvite(
  inviteId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminActor();
  if (!admin) return { success: false, error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("workspace_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("status", "pending");

  if (error) return { success: false, error: error.message };

  void logAuditEvent({
    actorId: admin.id,
    action: "invite.revoke",
    entityType: "invite",
    entityId: inviteId,
  });
  revalidatePath("/dashboard/admin/invites");
  return { success: true };
}
