"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceActivity(limit = 6) {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "workspace_activity"
      )
      .select("*")
      .eq(
        "workspace_id",
        workspace.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(limit);

    if (error) {
      console.error(
        "getWorkspaceActivity error:",
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      "getWorkspaceActivity failed:",
      error
    );

    return [];
  }
}
