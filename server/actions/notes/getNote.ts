"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTag } from "@/types/tag";

export type NoteDetail = {
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

export async function getNote(noteId: string): Promise<NoteDetail | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data: note, error } = await supabaseAdmin
      .from("workspace_notes")
      .select("id, title, content, created_at, user_id, company_id, contact_id")
      .eq("id", noteId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (error || !note) return null;

    const [companiesResult, contactsResult, tagsResult] = await Promise.all([
      note.company_id
        ? supabaseAdmin
            .from("workspace_companies")
            .select("id, name")
            .eq("id", note.company_id)
            .maybeSingle()
        : { data: null, error: null },

      note.contact_id
        ? supabaseAdmin
            .from("workspace_contacts")
            .select("id, first_name, last_name")
            .eq("id", note.contact_id)
            .maybeSingle()
        : { data: null, error: null },

      supabaseAdmin
        .from("workspace_entity_tags")
        .select("entity_id, workspace_tags(id, workspace_id, name, color, created_at)")
        .eq("workspace_id", workspace.id)
        .eq("entity_type", "note")
        .eq("entity_id", noteId),
    ]);

    const tags: WorkspaceTag[] = (tagsResult.data ?? [])
      .map((row) => row.workspace_tags as unknown as WorkspaceTag | null)
      .filter((t): t is WorkspaceTag => t !== null);

    const contactData = contactsResult.data;
    const contactName = contactData
      ? [contactData.first_name, contactData.last_name].filter(Boolean).join(" ") || contactData.first_name
      : null;

    return {
      ...note,
      content: note.content ?? null,
      companyName: companiesResult.data?.name ?? null,
      contactName: contactName ?? null,
      tags,
    };
  } catch (error) {
    logger.error("getNote failed:", error);
    return null;
  }
}
