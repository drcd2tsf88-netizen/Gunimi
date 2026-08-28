"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type TagOverviewItem = {
  id: string;
  name: string;
  color: string;
  aiSummary: string | null;
  aiSummaryAt: string | null;
  entityCount: number;
};

export async function getTagsOverview(): Promise<TagOverviewItem[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const [tagsResult, countsResult] = await Promise.all([
      supabaseAdmin
        .from("workspace_tags")
        .select("id, name, color, ai_summary, ai_summary_at")
        .eq("workspace_id", workspace.id)
        .order("name", { ascending: true }),
      supabaseAdmin
        .from("workspace_entity_tags")
        .select("tag_id")
        .eq("workspace_id", workspace.id),
    ]);

    const tags = tagsResult.data ?? [];
    const counts = countsResult.data ?? [];

    const countMap = new Map<string, number>();
    for (const row of counts) {
      countMap.set(row.tag_id, (countMap.get(row.tag_id) ?? 0) + 1);
    }

    return tags.map((t) => ({
      id: t.id as string,
      name: t.name as string,
      color: (t.color as string) ?? "violet",
      aiSummary: (t.ai_summary as string | null) ?? null,
      aiSummaryAt: (t.ai_summary_at as string | null) ?? null,
      entityCount: countMap.get(t.id as string) ?? 0,
    }));
  } catch (err) {
    logger.error("getTagsOverview failed:", err);
    return [];
  }
}
