"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { revalidatePath } from "next/cache";

async function assertPlatformAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.platform_role === "admin";
}

export async function setWorkspaceAISuspension(
  workspaceId: string,
  suspended: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!(await assertPlatformAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabaseAdmin
    .from("workspaces")
    .update({ ai_suspended: suspended })
    .eq("id", workspaceId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/admin/ai");
  return { success: true };
}

export async function setWorkspaceDailyTokenLimit(
  workspaceId: string,
  limit: number
): Promise<{ success: boolean; error?: string }> {
  if (!(await assertPlatformAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  if (!Number.isInteger(limit) || limit < 1_000 || limit > 10_000_000) {
    return { success: false, error: "Limit must be between 1,000 and 10,000,000" };
  }

  const { error } = await supabaseAdmin
    .from("workspaces")
    .update({ ai_daily_token_limit: limit })
    .eq("id", workspaceId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/admin/ai");
  return { success: true };
}
