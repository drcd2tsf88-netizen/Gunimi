"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type DealRelatedNote = {
  id: string;
  title: string;
  content?: string | null;
  created_at: string;
  source: "contact" | "company";
};

export async function getDealRelatedNotes(
  companyId?: string | null,
  contactId?: string | null
): Promise<DealRelatedNote[]> {
  if (!companyId && !contactId) return [];

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const results: DealRelatedNote[] = [];
    const seen = new Set<string>();

    if (contactId) {
      const { data } = await supabase
        .from("workspace_notes")
        .select("id, title, content, created_at")
        .eq("workspace_id", workspace.id)
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(6);

      for (const row of data ?? []) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          results.push({ ...row, source: "contact" } as DealRelatedNote);
        }
      }
    }

    if (companyId) {
      const { data } = await supabase
        .from("workspace_notes")
        .select("id, title, content, created_at")
        .eq("workspace_id", workspace.id)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(6);

      for (const row of data ?? []) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          results.push({ ...row, source: "company" } as DealRelatedNote);
        }
      }
    }

    return results.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("getDealRelatedNotes failed:", error);
    return [];
  }
}
