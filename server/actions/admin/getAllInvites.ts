import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type AdminInviteItem = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedByName: string;
};

export async function getAllInvites(): Promise<AdminInviteItem[]> {
  try {
    const { data: invites, error } = await supabaseAdmin
      .from("workspace_invites")
      .select("id, workspace_id, invited_by, email, role, status, expires_at, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error || !invites) return [];

    const wsIds = [...new Set(invites.map((i) => i.workspace_id as string).filter(Boolean))];
    const userIds = [...new Set(invites.map((i) => i.invited_by as string).filter(Boolean))];

    const [wsResult, profileResult] = await Promise.all([
      wsIds.length
        ? supabaseAdmin.from("workspaces").select("id, name").in("id", wsIds)
        : Promise.resolve({ data: [] }),
      userIds.length
        ? supabaseAdmin.from("profiles").select("id, full_name, email").in("id", userIds)
        : Promise.resolve({ data: [] }),
    ]);

    const wsMap = new Map(
      (wsResult.data ?? []).map((w: { id: string; name: string }) => [w.id, w.name])
    );
    const profileMap = new Map(
      (profileResult.data ?? []).map(
        (p: { id: string; full_name: string | null; email: string | null }) => [
          p.id,
          p.full_name ?? p.email ?? "Unknown",
        ]
      )
    );

    return invites.map((inv) => ({
      id: inv.id as string,
      workspaceId: inv.workspace_id as string,
      workspaceName: wsMap.get(inv.workspace_id as string) ?? "Unknown",
      email: inv.email as string,
      role: inv.role as string,
      status: inv.status as string,
      expiresAt: inv.expires_at as string,
      createdAt: inv.created_at as string,
      invitedByName: profileMap.get(inv.invited_by as string) ?? "Unknown",
    }));
  } catch (err) {
    logger.error("[getAllInvites] failed:", err);
    return [];
  }
}
