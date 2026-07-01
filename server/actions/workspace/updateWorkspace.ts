"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type UpdateWorkspaceParams = {
  name?: string;
};

export async function updateWorkspace(params: UpdateWorkspaceParams): Promise<boolean> {
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

    const oldName = workspace.name;

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({ name: params.name })
      .eq("id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    if (params.name && params.name !== oldName) {
      await supabaseAdmin
        .from("workspace_activity")
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          type: "workspace_renamed",
          title: "Workspace Renamed",
          description: `Renamed workspace from "${oldName}" to "${params.name}"`,
        });
    }

    revalidatePath("/dashboard/settings");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
