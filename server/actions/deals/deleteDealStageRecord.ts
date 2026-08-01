"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function deleteDealStageRecord(id: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const user = await getUser();
    if (!user) return { ok: false };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { ok: false };

    const supabase = await createClient();

    // Verify stage belongs to this workspace and get its slug
    const { data: stage } = await supabase
      .from("workspace_deal_stages")
      .select("slug")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!stage) return { ok: false, reason: "not_found" };

    // Check if any deals currently use this stage
    const { count } = await supabase
      .from("workspace_deals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("stage", stage.slug);

    if ((count ?? 0) > 0) {
      return { ok: false, reason: "deals_exist" };
    }

    const { error } = await supabase
      .from("workspace_deal_stages")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("deleteDealStageRecord error:", error);
      return { ok: false };
    }

    revalidatePath("/dashboard/deals");
    revalidatePath("/dashboard/settings");

    return { ok: true };
  } catch (err) {
    logger.error("deleteDealStageRecord exception:", err);
    return { ok: false };
  }
}
