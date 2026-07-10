"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

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

    if (!workspace) {
      return null;
    }

    // CLEAR PREVIOUS STATE

    await supabaseAdmin
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
      await supabaseAdmin
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
      logger.error(
        error
      );

      return null;
    }

    return data;
  } catch (error) {
    logger.error(error);

    return null;
  }
}