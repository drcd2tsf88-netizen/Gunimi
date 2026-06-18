"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceMemory() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }
const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "workspace_memory"
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
        .limit(12);

    if (error) {
      console.error(
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);

    return [];
  }
}