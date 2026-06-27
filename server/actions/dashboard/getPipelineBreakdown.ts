"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type PipelineStageRow = {
  stage: string;
  count: number;
  totalValue: number;
};

export type PipelineBreakdown = {
  stages: PipelineStageRow[];
  totalActiveValue: number;
  totalActiveCount: number;
  wonRevenue: number;
  staleDealsCount: number;
};

const ACTIVE_STAGES = ["lead", "qualified", "proposal", "negotiation"] as const;

const FALLBACK: PipelineBreakdown = {
  stages: [],
  totalActiveValue: 0,
  totalActiveCount: 0,
  wonRevenue: 0,
  staleDealsCount: 0,
};

export async function getPipelineBreakdown(): Promise<PipelineBreakdown> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const { data, error } = await supabaseAdmin
      .from("workspace_deals")
      .select("stage, value, updated_at")
      .eq("workspace_id", workspace.id);

    if (error || !data) return FALLBACK;

    const staleThreshold = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const stageMap = new Map<string, { count: number; totalValue: number }>();
    let wonRevenue = 0;
    let staleDealsCount = 0;

    for (const deal of data) {
      const stage = deal.stage as string;
      const value = (deal.value as number | null) ?? 0;
      const updatedAt = new Date(deal.updated_at as string).getTime();

      if (stage === "won") {
        wonRevenue += value;
        continue;
      }
      if (stage === "lost") continue;

      const existing = stageMap.get(stage) ?? { count: 0, totalValue: 0 };
      stageMap.set(stage, {
        count: existing.count + 1,
        totalValue: existing.totalValue + value,
      });

      if (!isNaN(updatedAt) && updatedAt < staleThreshold) {
        staleDealsCount++;
      }
    }

    const stages: PipelineStageRow[] = ACTIVE_STAGES.filter((s) => stageMap.has(s)).map(
      (s) => ({
        stage: s,
        count: stageMap.get(s)!.count,
        totalValue: stageMap.get(s)!.totalValue,
      })
    );

    return {
      stages,
      totalActiveValue: stages.reduce((sum, s) => sum + s.totalValue, 0),
      totalActiveCount: stages.reduce((sum, s) => sum + s.count, 0),
      wonRevenue,
      staleDealsCount,
    };
  } catch {
    return FALLBACK;
  }
}
