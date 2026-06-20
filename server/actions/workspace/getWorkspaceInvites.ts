"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type WorkspaceInvite = {
  id: string;
  email: string;
  status: string;
  created_at: string;
  expires_at: string | null;
};

export async function getWorkspaceInvites(): Promise<WorkspaceInvite[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_invites")
      .select("id, email, status, created_at, expires_at")
      .eq("workspace_id", workspace.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}
