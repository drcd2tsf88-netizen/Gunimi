"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

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