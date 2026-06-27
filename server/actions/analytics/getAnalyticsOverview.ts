"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AnalyticsOverview = {
  companies: number;
  deals: number;
  openTasks: number;
  members: number;
  upcomingMeetings: number;
  emailThreads: number;
};

const FALLBACK: AnalyticsOverview = {
  companies: 0,
  deals: 0,
  openTasks: 0,
  members: 0,
  upcomingMeetings: 0,
  emailThreads: 0,
};

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const supabase = await createClient();
    const now = new Date().toISOString();
    const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: companies },
      { count: deals },
      { count: openTasks },
      { count: members },
      { count: upcomingMeetings },
      { count: emailThreads },
    ] = await Promise.all([
      supabase
        .from("workspace_companies")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_deals")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .not("stage", "in", '("won","lost")'),
      supabase
        .from("workspace_tasks")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .neq("status", "done"),
      supabaseAdmin
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("calendar_events")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .neq("status", "cancelled")
        .gte("start_at", now)
        .lte("start_at", sevenDays),
      supabaseAdmin
        .from("email_threads")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);

    return {
      companies: companies ?? 0,
      deals: deals ?? 0,
      openTasks: openTasks ?? 0,
      members: members ?? 0,
      upcomingMeetings: upcomingMeetings ?? 0,
      emailThreads: emailThreads ?? 0,
    };
  } catch (error) {
    console.error("getAnalyticsOverview failed:", error);
    return FALLBACK;
  }
}
