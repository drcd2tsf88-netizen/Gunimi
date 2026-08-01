"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import { DEFAULT_DEAL_STAGES } from "@/lib/deals/defaultStages";
import type { WorkspaceDealStage } from "@/types/dealStage";

function hardcodedDefaults(_workspaceId: string): WorkspaceDealStage[] {
  return DEFAULT_DEAL_STAGES.map((s, i) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    order_index: i,
    color: s.color,
    is_won: s.is_won,
    is_lost: s.is_lost,
    created_at: new Date().toISOString(),
  }));
}

export async function getDealStages(): Promise<WorkspaceDealStage[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data: existing, error } = await supabase
      .from("workspace_deal_stages")
      .select("id, slug, name, order_index, color, is_won, is_lost, created_at")
      .eq("workspace_id", workspace.id)
      .order("order_index", { ascending: true });

    if (error) {
      logger.error("getDealStages error:", error);
      return hardcodedDefaults(workspace.id);
    }

    if (existing && existing.length > 0) {
      return existing as WorkspaceDealStage[];
    }

    // Seed default stages for this workspace
    const seeds = DEFAULT_DEAL_STAGES.map((s) => ({ ...s, workspace_id: workspace.id }));
    const { data: seeded, error: seedError } = await supabaseAdmin
      .from("workspace_deal_stages")
      .insert(seeds)
      .select("id, slug, name, order_index, color, is_won, is_lost, created_at");

    if (seedError) {
      logger.error("getDealStages seed error:", seedError);
      return hardcodedDefaults(workspace.id);
    }

    return (seeded ?? []) as WorkspaceDealStage[];
  } catch (err) {
    logger.error("getDealStages exception:", err);
    return [];
  }
}
