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
      .select("id, action, entity, entity_id, metadata, created_at, user_id, profiles(full_name)")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("getAuditLogs error:", error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id as string,
      action: row.action as string,
      entity: (row.entity as string | null) ?? null,
      entity_id: (row.entity_id as string | null) ?? null,
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      created_at: row.created_at as string,
      user_id: (row.user_id as string | null) ?? null,
      user_name:
        (row.profiles as { full_name?: string | null } | null)?.full_name ??
        null,
    }));
  } catch (err) {
    logger.error("getAuditLogs exception:", err);
    return [];
  }
}
