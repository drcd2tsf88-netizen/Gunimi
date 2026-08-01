"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export type WorkspaceNote = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  user_id: string;
  company_id: string | null;
  contact_id: string | null;
  companyName: string | null;
  contactName: string | null;
  tags: WorkspaceTag[];
};

export async function getWorkspaceNotes(): Promise<WorkspaceNote[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_notes")
      .select("id, title, content, created_at, user_id, company_id, contact_id")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getWorkspaceNotes error:", error);
      return [];
    }

    const notes = data ?? [];
    if (notes.length === 0) return [];

    // Collect unique company/contact IDs
    const companyIds = [...new Set(notes.map((n) => n.company_id).filter(Boolean) as string[])];
    const contactIds = [...new Set(notes.map((n) => n.contact_id).filter(Boolean) as string[])];
    const noteIds = notes.map((n) => n.id);

    const [companiesResult, contactsResult, tagsResult] = await Promise.all([
      companyIds.length > 0
        ? supabaseAdmin
            .from("workspace_companies")
            .select("id, name")
            .in("id", companyIds)
        : { data: [], error: null },

      contactIds.length > 0
        ? supabaseAdmin
            .from("workspace_contacts")
            .select("id, first_name, last_name")
            .in("id", contactIds)
        : { data: [], error: null },

      supabaseAdmin
        .from("workspace_entity_tags")
        .select("entity_id, workspace_tags(id, workspace_id, name, color, created_at)")
        .eq("workspace_id", workspace.id)
        .eq("entity_type", "note")
        .in("entity_id", noteIds),
    ]);

    const companyMap = new Map<string, string>();
    for (const c of companiesResult.data ?? []) {
      companyMap.set(c.id, c.name);
    }

    const contactMap = new Map<string, string>();
    for (const c of contactsResult.data ?? []) {
      contactMap.set(c.id, [c.first_name, c.last_name].filter(Boolean).join(" ") || c.first_name || "");
    }

    const noteTagsMap = new Map<string, WorkspaceTag[]>();
    for (const row of tagsResult.data ?? []) {
      const tag = row.workspace_tags as unknown as WorkspaceTag | null;
      if (!tag) continue;
      const existing = noteTagsMap.get(row.entity_id) ?? [];
      existing.push(tag);
      noteTagsMap.set(row.entity_id, existing);
    }

    return notes.map((n) => ({
      ...n,
      content: n.content ?? null,
      companyName: n.company_id ? (companyMap.get(n.company_id) ?? null) : null,
      contactName: n.contact_id ? (contactMap.get(n.contact_id) ?? null) : null,
      tags: noteTagsMap.get(n.id) ?? [],
    }));
  } catch (error) {
    logger.error("getWorkspaceNotes failed:", error);
    return [];
  }
}
