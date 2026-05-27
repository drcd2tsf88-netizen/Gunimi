"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceAIState() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }
const supabase = await createClient();
    const {
      data,
      error,
    } =
      await supabase
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
