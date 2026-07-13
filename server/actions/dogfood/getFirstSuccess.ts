"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type FirstSuccessMetrics = {
  totalWorkspaces: number;
  workspacesWithContact: number;
  workspacesWithDeal: number;
  workspacesWithSignal: number;
};

async function assertPlatformTeam(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("platform_role")
      .eq("id", user.id)
      .maybeSingle();
    return ["admin", "team"].includes(profile?.platform_role ?? "");
  } catch {
    return false;
  }
}

export async function getFirstSuccess(): Promise<FirstSuccessMetrics | null> {
  try {
    const allowed = await assertPlatformTeam();
    if (!allowed) return null;

    const [
      { count: totalWorkspaces },
      { count: workspacesWithContact },
      { count: workspacesWithDeal },
      { count: workspacesWithSignal },
    ] = await Promise.all([
      supabaseAdmin.from("workspaces").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("contacts").select("workspace_id", { count: "exact", head: true }),
      supabaseAdmin.from("deals").select("workspace_id", { count: "exact", head: true }),
      supabaseAdmin.from("workspace_signals").select("workspace_id", { count: "exact", head: true }),
    ]);

    return {
      totalWorkspaces: totalWorkspaces ?? 0,
      workspacesWithContact: workspacesWithContact ?? 0,
      workspacesWithDeal: workspacesWithDeal ?? 0,
      workspacesWithSignal: workspacesWithSignal ?? 0,
    };
  } catch (err) {
    logger.error("getFirstSuccess unexpected error", err);
    return null;
  }
}
