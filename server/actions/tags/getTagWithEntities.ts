"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export type TagContact = { id: string; first_name: string; last_name: string | null; email: string | null };
export type TagCompany = { id: string; name: string; industry: string | null };
export type TagDeal = { id: string; name: string; stage: string | null; value: number | null };
export type TagTask = { id: string; title: string; status: string; priority: string };
export type TagNote = { id: string; title: string; created_at: string };

export type TagWithEntities = {
  tag: WorkspaceTag;
  contacts: TagContact[];
  companies: TagCompany[];
  deals: TagDeal[];
  tasks: TagTask[];
  notes: TagNote[];
};

async function getEntityIds(
  supabase: typeof supabaseAdmin,
  workspaceId: string,
  tagId: string,
  entityType: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("workspace_entity_tags")
    .select("entity_id")
    .eq("workspace_id", workspaceId)
    .eq("tag_id", tagId)
    .eq("entity_type", entityType);
  return (data ?? []).map((r) => r.entity_id);
}

export async function getTagWithEntities(tagId: string): Promise<TagWithEntities | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data: tag } = await supabaseAdmin
      .from("workspace_tags")
      .select("id, workspace_id, name, color, created_at")
      .eq("id", tagId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!tag) return null;

    const [contactIds, companyIds, dealIds, taskIds, noteIds] = await Promise.all([
      getEntityIds(supabaseAdmin, workspace.id, tagId, "contact"),
      getEntityIds(supabaseAdmin, workspace.id, tagId, "company"),
      getEntityIds(supabaseAdmin, workspace.id, tagId, "deal"),
      getEntityIds(supabaseAdmin, workspace.id, tagId, "task"),
      getEntityIds(supabaseAdmin, workspace.id, tagId, "note"),
    ]);

    const [contactsRes, companiesRes, dealsRes, tasksRes, notesRes] = await Promise.all([
      contactIds.length > 0
        ? supabaseAdmin.from("workspace_people").select("id, first_name, last_name, email").in("id", contactIds)
        : { data: [] },
      companyIds.length > 0
        ? supabaseAdmin.from("workspace_companies").select("id, name, industry").in("id", companyIds)
        : { data: [] },
      dealIds.length > 0
        ? supabaseAdmin.from("workspace_deals").select("id, name, stage, value").in("id", dealIds)
        : { data: [] },
      taskIds.length > 0
        ? supabaseAdmin.from("workspace_tasks").select("id, title, status, priority").in("id", taskIds)
        : { data: [] },
      noteIds.length > 0
        ? supabaseAdmin.from("workspace_notes").select("id, title, created_at").in("id", noteIds)
        : { data: [] },
    ]);

    return {
      tag: tag as WorkspaceTag,
      contacts: (contactsRes.data ?? []) as TagContact[],
      companies: (companiesRes.data ?? []) as TagCompany[],
      deals: (dealsRes.data ?? []) as TagDeal[],
      tasks: (tasksRes.data ?? []) as TagTask[],
      notes: (notesRes.data ?? []) as TagNote[],
    };
  } catch (err) {
    logger.error("getTagWithEntities failed:", err);
    return null;
  }
}
