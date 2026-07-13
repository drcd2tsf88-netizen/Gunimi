"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import type { FeedbackCategory, FeedbackSeverity } from "./submitFeedback";

export type FeedbackStatus = "open" | "in_progress" | "resolved";

export type DogfoodFeedbackRow = {
  id: string;
  workspace_id: string;
  workspace_name: string | null;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  route: string | null;
  browser: string | null;
  viewport: string | null;
  language: string | null;
  timezone: string | null;
  status: FeedbackStatus;
  owner: string | null;
  session_note: boolean;
  created_at: string;
  resolved_at: string | null;
};

type RawFeedbackRow = {
  id: string;
  workspace_id: string;
  user_id: string;
  category: string;
  severity: string;
  message: string;
  route: string | null;
  browser: string | null;
  viewport: string | null;
  language: string | null;
  timezone: string | null;
  status: string;
  owner: string | null;
  session_note: boolean;
  created_at: string;
  resolved_at: string | null;
  workspaces: { name: string } | null;
  profiles: { full_name: string | null; email: string | null } | null;
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

export async function getFeedback(): Promise<DogfoodFeedbackRow[]> {
  try {
    const allowed = await assertPlatformTeam();
    if (!allowed) return [];

    const { data, error } = await supabaseAdmin
      .from("dogfood_feedback")
      .select(`
        id, workspace_id, user_id, category, severity, message, route,
        browser, viewport, language, timezone, status, owner, session_note,
        created_at, resolved_at,
        workspaces!dogfood_feedback_workspace_id_fkey(name),
        profiles!dogfood_feedback_user_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      logger.error("getFeedback query failed", error);
      return [];
    }

    return ((data ?? []) as unknown as RawFeedbackRow[]).map((row) => ({
      id: row.id,
      workspace_id: row.workspace_id,
      workspace_name: row.workspaces?.name ?? null,
      user_id: row.user_id,
      user_name: row.profiles?.full_name ?? null,
      user_email: row.profiles?.email ?? null,
      category: row.category as FeedbackCategory,
      severity: row.severity as FeedbackSeverity,
      message: row.message,
      route: row.route,
      browser: row.browser,
      viewport: row.viewport,
      language: row.language,
      timezone: row.timezone,
      status: row.status as FeedbackStatus,
      owner: row.owner,
      session_note: row.session_note,
      created_at: row.created_at,
      resolved_at: row.resolved_at,
    }));
  } catch (err) {
    logger.error("getFeedback unexpected error", err);
    return [];
  }
}
