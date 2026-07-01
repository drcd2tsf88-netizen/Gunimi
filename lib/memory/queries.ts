import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { formatAsMemoryEvent } from "./format";
import { MILESTONE_TYPES } from "./importance";
import type { MemoryEvent } from "./types";

const ACTIVITY_COLUMNS =
  "id, type, title, description, deal_id, contact_id, company_id, created_at, metadata";

export async function getWorkspaceMemory(
  workspaceId: string,
  limit = 50
): Promise<MemoryEvent[]> {
  const { data } = await supabaseAdmin
    .from("workspace_activity")
    .select(ACTIVITY_COLUMNS)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(formatAsMemoryEvent);
}

export async function getWorkspaceMilestones(
  workspaceId: string,
  limit = 20
): Promise<MemoryEvent[]> {
  const { data } = await supabaseAdmin
    .from("workspace_activity")
    .select(ACTIVITY_COLUMNS)
    .eq("workspace_id", workspaceId)
    .in("type", MILESTONE_TYPES)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(formatAsMemoryEvent);
}

export async function getEntityMemoryEvents(
  workspaceId: string,
  entityType: "deal" | "contact" | "company",
  entityId: string,
  limit = 20
): Promise<MemoryEvent[]> {
  const column =
    entityType === "deal"
      ? "deal_id"
      : entityType === "contact"
      ? "contact_id"
      : "company_id";

  const { data } = await supabaseAdmin
    .from("workspace_activity")
    .select(ACTIVITY_COLUMNS)
    .eq("workspace_id", workspaceId)
    .eq(column, entityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(formatAsMemoryEvent);
}

export async function getWorkspaceMemoryStats(workspaceId: string): Promise<{
  total: number;
  milestones: number;
  critical: number;
}> {
  const [totalRes, milestonesRes, criticalRes] = await Promise.all([
    supabaseAdmin
      .from("workspace_activity")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    supabaseAdmin
      .from("workspace_activity")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .in("type", MILESTONE_TYPES),
    supabaseAdmin
      .from("workspace_activity")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .in("type", ["deal_won", "deal_lost"]),
  ]);

  return {
    total: totalRes.count ?? 0,
    milestones: milestonesRes.count ?? 0,
    critical: criticalRes.count ?? 0,
  };
}
