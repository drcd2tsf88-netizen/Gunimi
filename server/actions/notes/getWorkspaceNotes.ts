"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceNotes() {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_notes")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getWorkspaceNotes error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getWorkspaceNotes failed:", error);
    return [];
  }
}
