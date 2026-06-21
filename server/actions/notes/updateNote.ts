"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type UpdateNoteProps = {
  noteId: string;
  title: string;
  content?: string;
};

export async function updateNote({
  noteId,
  title,
  content,
}: UpdateNoteProps) {
  try {
    if (!noteId || !title.trim()) return null;

    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    // No UPDATE RLS policy on workspace_notes — use supabaseAdmin with user_id guard
    const { data, error } = await supabaseAdmin
      .from("workspace_notes")
      .update({
        title: title.trim(),
        content: content?.trim() || null,
      })
      .eq("id", noteId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      return null;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "note_updated",
      title: "Note Updated",
      description: `Updated note "${title.trim()}"`,
    });

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
