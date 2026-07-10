"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

type CreateAIActionProps = {
  title: string;

  description?: string;

  action_label?: string;

  action_route?: string;

  priority?: string;
};

export async function createAIAction({
  title,

  description,

  action_label,

  action_route,

  priority = "medium",
  
}
: CreateAIActionProps) {
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
          "workspace_ai_actions"
        )
        .insert([
          {
            workspace_id:
              workspace.id,

            title,

            description,

            action_label,

            action_route,

            priority,
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