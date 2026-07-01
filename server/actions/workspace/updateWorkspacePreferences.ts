"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { WorkspacePreferences } from "./getWorkspaceSettings";

export type { WorkspacePreferences };

export async function updateWorkspacePreferences(
  preferences: WorkspacePreferences
): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return false;
    }

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({ preferences })
      .eq("id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    revalidatePath("/dashboard/settings");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
