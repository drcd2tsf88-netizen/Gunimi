"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function deleteNote(noteId: string) {
  try {
    if (!noteId) return false;

    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    // Verify note belongs to this workspace and get title for activity
    const { data: note } = await supabaseAdmin
      .from("workspace_notes")
      .select("id, title, workspace_id")
      .eq("id", noteId)
      .eq("workspace_id", workspace.id)
      .single();

    if (!note) return false;

    // DELETE FIRST — activity never blocks deletion
    const { error: deleteError } = await supabaseAdmin
      .from("workspace_notes")
      .delete()
      .eq("id", noteId)
      .eq("workspace_id", workspace.id);

    if (deleteError) {
      console.error("deleteNote error:", deleteError);
      return false;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "note_deleted",
      title: "Note Deleted",
      description: `Deleted note "${note.title}"`,
    });

    revalidatePath("/dashboard/notes");

    return true;
  } catch (error) {
    console.error("deleteNote failed:", error);
    return false;
  }
}
