import { supabaseAdmin } from "./supabaseAdmin";

export async function getWorkspaceRole(workspaceId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .single();

  return data?.role || null;
}

export async function isWorkspaceAdmin(workspaceId: string, userId: string) {
  const role = await getWorkspaceRole(workspaceId, userId);
  return role === "owner" || role === "admin";
}
