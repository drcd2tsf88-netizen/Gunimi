"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AIStats = {
  workspaceName: string;
  openDeals: number;
  pipelineValue: number;
  totalContacts: number;
  totalCompanies: number;
  openTasks: number;
  overdueTasks: number;
  totalMembers: number;
  wonDealsLast30: number;
  wonValueLast30: number;
  lostDealsLast30: number;
  winRate: number;
  staleDeals: number;
  revenueAtRisk: number;
  healthyDeals: number;
  warningDeals: number;
  atRiskDeals: number;
};

type ClosedDealRow = { stage: string; value: number | null };
type OpenDealRow = {
  value: number | null;
  probability: number | null;
  updated_at: string;
  stage: string;
};

const MS_PER_DAY = 86_400_000;

export async function getAIStats(): Promise<AIStats | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();
    const thirtyDaysAgo = new Date(Date.now() - 30 * MS_PER_DAY).toISOString();
    const now = new Date().toISOString();

    const [
      workspaceResult,
      openDealsResult,
      contactsResult,
      companiesResult,
      tasksResult,
      overdueTasksResult,
      membersResult,
      closedDealsResult,
    ] = await Promise.all([
      supabase.from("workspaces").select("name").eq("id", workspace.id).single(),
      supabase
        .from("workspace_deals")
        .select("value, probability, updated_at, stage")
        .eq("workspace_id", workspace.id)
        .neq("stage", "won")
        .neq("stage", "lost"),
      supabase
        .from("workspace_contacts")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_companies")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_tasks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .neq("status", "done"),
      supabase
        .from("workspace_tasks")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .neq("status", "done")
        .lt("due_date", now),
      supabaseAdmin
        .from("workspace_members")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_deals")
        .select("stage, value")
        .eq("workspace_id", workspace.id)
        .in("stage", ["won", "lost"])
        .gte("updated_at", thirtyDaysAgo),
    ]);

    const nowMs = Date.now();
    const openDeals = ((openDealsResult.data ?? []) as unknown as OpenDealRow[]);
    const pipelineValue = openDeals.reduce(
      (s, d) => s + (d.value != null ? Number(d.value) : 0),
      0
    );

    let staleDeals = 0;
    let revenueAtRisk = 0;
    let healthyDeals = 0;
    let warningDeals = 0;
    let atRiskDeals = 0;

    for (const d of openDeals) {
      const daysSince = Math.floor(
        (nowMs - new Date(d.updated_at).getTime()) / MS_PER_DAY
      );
      if (daysSince > 7) {
        staleDeals++;
        revenueAtRisk += d.value != null ? Number(d.value) : 0;
      }
      const prob = d.probability != null ? Number(d.probability) : null;
      const base = prob ?? 50;
      const staleFactor = Math.max(0, 1 - daysSince / 30);
      const health = Math.max(0, Math.min(100, Math.round(base * staleFactor)));
      if (health >= 70) healthyDeals++;
      else if (health >= 40) warningDeals++;
      else atRiskDeals++;
    }

    const closedDeals = ((closedDealsResult.data ?? []) as unknown as ClosedDealRow[]);
    const wonDeals = closedDeals.filter((d) => d.stage === "won");
    const lostDeals = closedDeals.filter((d) => d.stage === "lost");
    const wonValueLast30 = wonDeals.reduce(
      (s, d) => s + (d.value != null ? Number(d.value) : 0),
      0
    );
    const winRate =
      wonDeals.length + lostDeals.length > 0
        ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
        : 0;

    const workspaceName =
      (workspaceResult.data as unknown as { name: string } | null)?.name ?? "Workspace";

    return {
      workspaceName,
      openDeals: openDeals.length,
      pipelineValue,
      totalContacts: contactsResult.count ?? 0,
      totalCompanies: companiesResult.count ?? 0,
      openTasks: tasksResult.count ?? 0,
      overdueTasks: overdueTasksResult.count ?? 0,
      totalMembers: membersResult.count ?? 0,
      wonDealsLast30: wonDeals.length,
      wonValueLast30,
      lostDealsLast30: lostDeals.length,
      winRate,
      staleDeals,
      revenueAtRisk,
      healthyDeals,
      warningDeals,
      atRiskDeals,
    };
  } catch {
    return null;
  }
}
