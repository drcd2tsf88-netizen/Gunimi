"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type CreateNoteProps = {
  title: string;
  content?: string;
  companyId?: string;
  contactId?: string;
};

export async function createNote({ title, content, companyId, contactId }: CreateNoteProps) {
  try {
    if (!title.trim()) return null;

    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit(user.id)) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data, error } = await supabaseAdmin
      .from("workspace_notes")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        company_id: companyId || null,
        contact_id: contactId || null,
        title: title.trim(),
        content: content?.trim() || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("createNote error:", error);
      return null;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      company_id: companyId || null,
      type: "note_created",
      title: "Note Created",
      description: `Created note "${title.trim()}"`,
    });

    revalidatePath("/dashboard/notes");

    return data;
  } catch (error) {
    console.error("createNote failed:", error);
    return null;
  }
}
