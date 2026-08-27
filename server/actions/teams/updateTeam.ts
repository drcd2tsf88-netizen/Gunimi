"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { revalidatePath } from "next/cache";
import type { TeamColor } from "@/types/team";

export async function updateTeam(
  teamId: string,
  updates: { name?: string; color?: TeamColor }
): Promise<{ success: boolean; error?: string }> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false, error: "no_workspace" };

  const supabase = await createClient();

  const payload: Record<string, string> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.color !== undefined) payload.color = updates.color;

  const { error } = await supabase
    .from("workspace_teams")
    .update(payload)
    .eq("id", teamId)
    .eq("workspace_id", workspace.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
