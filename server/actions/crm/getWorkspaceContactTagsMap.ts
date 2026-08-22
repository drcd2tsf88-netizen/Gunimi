"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export type ContactTagsMap = Record<string, WorkspaceTag[]>;

export async function getWorkspaceContactTagsMap(): Promise<ContactTagsMap> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return {};

    const { data: links } = await supabaseAdmin
      .from("workspace_entity_tags")
      .select("entity_id, tag_id")
      .eq("workspace_id", workspace.id)
      .eq("entity_type", "contact");

    if (!links || links.length === 0) return {};

    const tagIds = [...new Set(links.map((l) => l.tag_id))];

    const { data: tags } = await supabaseAdmin
      .from("workspace_tags")
      .select("id, workspace_id, name, color, created_at")
      .in("id", tagIds);

    if (!tags) return {};

    const tagById = new Map<string, WorkspaceTag>(
      (tags as WorkspaceTag[]).map((t) => [t.id, t])
    );

    const result: ContactTagsMap = {};
    for (const link of links) {
      const tag = tagById.get(link.tag_id);
      if (!tag) continue;
      if (!result[link.entity_id]) result[link.entity_id] = [];
      result[link.entity_id].push(tag);
    }
    return result;
  } catch (err) {
    logger.error("getWorkspaceContactTagsMap failed:", err);
    return {};
  }
}
