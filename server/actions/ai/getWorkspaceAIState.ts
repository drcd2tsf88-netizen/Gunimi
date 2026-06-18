"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceAIState() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }
const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "workspace_ai_state"
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
        .limit(1)
        .single();

    if (error) {
      console.error(
        error
      );

      return null;
    }

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}
