"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function getWorkspaceAIActions() {
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
      logger.error(
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(error);

    return [];
  }
}