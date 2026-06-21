"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceMembers() {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_members")
      .select(`
        id,
        role,
        user_id,
        profiles (
          id,
          email,
          full_name,
          avatar_url,
          status
        )
      `)
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getWorkspaceMembers error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getWorkspaceMembers failed:", error);
    return [];
  }
}
