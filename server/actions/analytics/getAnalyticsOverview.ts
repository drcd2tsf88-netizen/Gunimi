"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AnalyticsOverview = {
  companies: number;
  deals: number;
  openTasks: number;
  members: number;
};

const FALLBACK: AnalyticsOverview = {
  companies: 0,
  deals: 0,
  openTasks: 0,
  members: 0,
};

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const supabase = await createClient();

    const [
      { count: companies },
      { count: deals },
      { count: openTasks },
      { count: members },
    ] = await Promise.all([
      supabase
        .from("workspace_companies")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_deals")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_tasks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .neq("status", "done"),
      supabaseAdmin
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);

    return {
      companies: companies ?? 0,
      deals: deals ?? 0,
      openTasks: openTasks ?? 0,
      members: members ?? 0,
    };
  } catch (error) {
    console.error("getAnalyticsOverview failed:", error);
    return FALLBACK;
  }
}
