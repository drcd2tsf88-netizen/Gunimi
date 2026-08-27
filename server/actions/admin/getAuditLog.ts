"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type AuditLogEntry = {
  id: string;
  createdAt: string;
  actorId: string | null;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  workspaceId: string | null;
  workspaceName: string;
  metadata: Record<string, unknown>;
};

export async function getAuditLog(limit = 200): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("id, created_at, actor_id, action, entity_type, entity_id, workspace_id, metadata")
      .not("action", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    const actorIds = [...new Set(data.map((r) => r.actor_id as string).filter(Boolean))];
    const wsIds = [...new Set(data.map((r) => r.workspace_id as string).filter(Boolean))];

    const [profileResult, wsResult] = await Promise.all([
      actorIds.length
        ? supabaseAdmin.from("profiles").select("id, full_name, email").in("id", actorIds)
        : Promise.resolve({ data: [] }),
      wsIds.length
        ? supabaseAdmin.from("workspaces").select("id, name").in("id", wsIds)
        : Promise.resolve({ data: [] }),
    ]);

    const profileMap = new Map(
      (profileResult.data ?? []).map((p: { id: string; full_name: string | null; email: string | null }) => [
        p.id, { name: p.full_name ?? p.email ?? "Unknown", email: p.email ?? "" },
      ])
    );
    const wsMap = new Map(
      (wsResult.data ?? []).map((w: { id: string; name: string }) => [w.id, w.name])
    );

    return data.map((r) => {
      const profile = profileMap.get(r.actor_id as string);
      return {
        id: r.id as string,
        createdAt: r.created_at as string,
        actorId: (r.actor_id as string | null) ?? null,
        actorName: profile?.name ?? "System",
        actorEmail: profile?.email ?? "",
        action: (r.action as string) ?? "",
        entityType: (r.entity_type as string | null) ?? null,
        entityId: (r.entity_id as string | null) ?? null,
        workspaceId: (r.workspace_id as string | null) ?? null,
        workspaceName: wsMap.get(r.workspace_id as string) ?? "—",
        metadata: ((r.metadata as Record<string, unknown>) ?? {}),
      };
    });
  } catch (err) {
    logger.error("[getAuditLog] failed:", err);
    return [];
  }
}
