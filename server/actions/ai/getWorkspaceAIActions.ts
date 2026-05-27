"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceAIActions() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }
const supabase = await createClient();
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_ai_actions"
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
        .limit(6);

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