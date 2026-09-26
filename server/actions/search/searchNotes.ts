"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type NoteRow = {
  id: string;
  title: string;
  content: string | null;
};

export type NoteSearchRows = {
  notes: NoteRow[];
};

const EMPTY: NoteSearchRows = { notes: [] };

export async function searchNotes(query: string): Promise<NoteSearchRows> {
  if (!query.trim()) return EMPTY;

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();
    const pattern = `%${query}%`;

    const { data, error } = await supabase
      .from("workspace_notes")
      .select("id, title, content")
      .eq("workspace_id", workspace.id)
      .or(`title.ilike.${pattern},content.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      logger.error("[searchNotes] query failed:", error);
      return EMPTY;
    }

    return { notes: (data ?? []) as NoteRow[] };
  } catch (err) {
    logger.error("[searchNotes] unexpected error:", err);
    return EMPTY;
  }
}
