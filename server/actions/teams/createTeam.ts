"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { revalidatePath } from "next/cache";
import type { TeamColor, WorkspaceTeam } from "@/types/team";

export async function createTeam(
  name: string,
  color: TeamColor
): Promise<{ success: boolean; team?: WorkspaceTeam; error?: string }> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false, error: "no_workspace" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspace_teams")
    .insert({ workspace_id: workspace.id, name: name.trim(), color })
    .select("id, workspace_id, name, color, created_at")
    .single();

  if (error || !data) return { success: false, error: error?.message };

  revalidatePath("/dashboard/settings");
  return { success: true, team: data as WorkspaceTeam };
}
