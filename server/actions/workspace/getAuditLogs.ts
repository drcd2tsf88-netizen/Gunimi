"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type AuditLogEntry = {
  id: string;
  action: string;
  entity: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
  user_name: string | null;
};

export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("id, action, entity, entity_id, metadata, created_at, user_id")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("getAuditLogs error:", error);
      return [];
    }

    const rows = data ?? [];

    // Resolve user names from profiles in one batch query
    const userIds = [...new Set(rows.map((r) => r.user_id as string | null).filter(Boolean))] as string[];
    const nameMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      for (const p of profiles ?? []) {
        if (p.id && p.full_name) nameMap[p.id as string] = p.full_name as string;
      }
    }

    return rows.map((row) => ({
      id: row.id as string,
      action: row.action as string,
      entity: (row.entity as string | null) ?? null,
      entity_id: (row.entity_id as string | null) ?? null,
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      created_at: row.created_at as string,
      user_id: (row.user_id as string | null) ?? null,
      user_name: (row.user_id ? nameMap[row.user_id as string] : null) ?? null,
    }));
  } catch (err) {
    logger.error("getAuditLogs exception:", err);
    return [];
  }
}
