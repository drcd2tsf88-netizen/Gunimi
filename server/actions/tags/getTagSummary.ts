"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type TagSummary = {
  contacts: number;
  companies: number;
  deals: number;
  tasks: number;
  notes: number;
};

export async function getTagSummary(tagId: string): Promise<TagSummary | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data } = await supabaseAdmin
      .from("workspace_entity_tags")
      .select("entity_type")
      .eq("workspace_id", workspace.id)
      .eq("tag_id", tagId);

    if (!data) return null;

    const counts: TagSummary = { contacts: 0, companies: 0, deals: 0, tasks: 0, notes: 0 };
    for (const row of data) {
      if (row.entity_type === "contact") counts.contacts++;
      else if (row.entity_type === "company") counts.companies++;
      else if (row.entity_type === "deal") counts.deals++;
      else if (row.entity_type === "task") counts.tasks++;
      else if (row.entity_type === "note") counts.notes++;
    }
    return counts;
  } catch (err) {
    logger.error("getTagSummary failed:", err);
    return null;
  }
}
