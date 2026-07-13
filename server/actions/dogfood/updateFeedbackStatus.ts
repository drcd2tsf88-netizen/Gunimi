"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import type { FeedbackStatus } from "./getFeedback";

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

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
  owner?: string,
): Promise<boolean> {
  try {
    const allowed = await assertPlatformTeam();
    if (!allowed) return false;

    const update: Record<string, unknown> = { status };
    if (owner !== undefined) update.owner = owner;
    if (status === "resolved") update.resolved_at = new Date().toISOString();
    if (status === "open" || status === "in_progress") update.resolved_at = null;

    const { error } = await supabaseAdmin
      .from("dogfood_feedback")
      .update(update)
      .eq("id", id);

    if (error) {
      logger.error("updateFeedbackStatus failed", error);
      return false;
    }

    revalidatePath("/dashboard/admin/dogfood");
    return true;
  } catch (err) {
    logger.error("updateFeedbackStatus unexpected error", err);
    return false;
  }
}
