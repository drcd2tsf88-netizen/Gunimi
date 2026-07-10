"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function getWorkspaceTasks() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }
const supabase =
      await createClient();
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_tasks"
        )
        .select(`
  id,
  title,
  description,
  status,
  priority,
  assigned_to,
  due_date,
  created_at,
  updated_at
`)
        .eq(
          "workspace_id",
          workspace.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      logger.error(
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(
      error
    );

    return [];
  }
}