"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AINote = {
  id: string;
  title: string | null;
  content: string;
  contactId: string | null;
  companyId: string | null;
  createdAt: string;
};

type RawNoteRow = {
  id: string;
  title: string | null;
  content: string;
  contact_id: string | null;
  company_id: string | null;
  created_at: string;
};

export async function getAINotes(limit = 20): Promise<AINote[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_notes")
      .select("id, title, content, contact_id, company_id, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as unknown as RawNoteRow[]).map((n) => ({
      id: n.id,
      title: n.title ?? null,
      content: n.content,
      contactId: n.contact_id ?? null,
      companyId: n.company_id ?? null,
      createdAt: n.created_at,
    }));
  } catch {
    return [];
  }
}
