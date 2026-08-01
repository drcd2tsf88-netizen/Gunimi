"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import type { WorkspaceDealStage } from "@/types/dealStage";

type CreateDealStageParams = {
  name: string;
  color: string;
  is_won: boolean;
  is_lost: boolean;
};

export async function createDealStage(
  params: CreateDealStageParams
): Promise<WorkspaceDealStage | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    // Generate slug from name
    const slug =
      params.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "") || `stage_${Date.now()}`;

    // Get current max order_index
    const { data: existing } = await supabase
      .from("workspace_deal_stages")
      .select("order_index")
      .eq("workspace_id", workspace.id)
      .order("order_index", { ascending: false })
      .limit(1);

    const maxOrder = existing?.[0]?.order_index ?? -1;

    const { data, error } = await supabase
      .from("workspace_deal_stages")
      .insert({
        workspace_id: workspace.id,
        slug,
        name: params.name.trim(),
        color: params.color,
        is_won: params.is_won,
        is_lost: params.is_lost,
        order_index: maxOrder + 1,
      })
      .select("id, slug, name, order_index, color, is_won, is_lost, created_at")
      .single();

    if (error) {
      logger.error("createDealStage error:", error);
      return null;
    }

    revalidatePath("/dashboard/deals");
    revalidatePath("/dashboard/settings");

    return data as WorkspaceDealStage;
  } catch (err) {
    logger.error("createDealStage exception:", err);
    return null;
  }
}
