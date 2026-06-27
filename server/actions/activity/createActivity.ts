"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

import { getUser } from "@/server/actions/auth/getUser";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

type CreateActivityProps = {
  type: string;
  title: string;
  description: string;
};

export async function createActivity({
  type,
  title,
  description,
}: CreateActivityProps) {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const workspace = await getCurrentWorkspace();

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type,
        title,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("createActivity error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("createActivity failed:", error);
    return null;
  }
}
