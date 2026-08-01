"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

type UpdateDealStageRecordParams = {
  id: string;
  name?: string;
  color?: string;
  is_won?: boolean;
  is_lost?: boolean;
  order_index?: number;
};

export async function updateDealStageRecord(
  params: UpdateDealStageRecordParams
): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const update: Record<string, unknown> = {};
    if (params.name !== undefined) update.name = params.name.trim();
    if (params.color !== undefined) update.color = params.color;
    if (params.is_won !== undefined) update.is_won = params.is_won;
    if (params.is_lost !== undefined) update.is_lost = params.is_lost;
    if (params.order_index !== undefined) update.order_index = params.order_index;

    const { error } = await supabase
      .from("workspace_deal_stages")
      .update(update)
      .eq("id", params.id)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("updateDealStageRecord error:", error);
      return false;
    }

    revalidatePath("/dashboard/deals");
    revalidatePath("/dashboard/settings");

    return true;
  } catch (err) {
    logger.error("updateDealStageRecord exception:", err);
    return false;
  }
}
