"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { revalidatePath } from "next/cache";

export async function deleteTeam(teamId: string): Promise<{ success: boolean; error?: string }> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false, error: "no_workspace" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("workspace_teams")
    .delete()
    .eq("id", teamId)
    .eq("workspace_id", workspace.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
