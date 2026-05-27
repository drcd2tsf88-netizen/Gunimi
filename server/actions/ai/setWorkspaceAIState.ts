"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

type SetWorkspaceAIStateProps = {
  state: string;

  context?: string;
};

export async function setWorkspaceAIState({
  state,

  context,
}: SetWorkspaceAIStateProps) {
  try {
    const workspace =
      await getCurrentWorkspace();

    const supabase = await createClient();

    if (!workspace) {
      return null;
    }

    // CLEAR PREVIOUS STATE

    await supabase
      .from(
        "workspace_ai_state"
      )
      .delete()
      .eq(
        "workspace_id",
        workspace.id
      );

    // INSERT NEW STATE

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_ai_state"
        )
        .insert([
          {
            workspace_id:
              workspace.id,

            state,

            context,
          },
        ])
        .select()
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