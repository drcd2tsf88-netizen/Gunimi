"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function bulkDeleteContacts(ids: string[]): Promise<{ deleted: number; error?: string }> {
  if (!ids.length) return { deleted: 0 };

  try {
    const user = await getUser();
    if (!user) return { deleted: 0, error: "unauthenticated" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { deleted: 0, error: "no_workspace" };

    const supabase = await createClient();

    const { error, count } = await supabase
      .from("workspace_people")
      .delete({ count: "exact" })
      .in("id", ids)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error("bulkDeleteContacts error:", error);
      return { deleted: 0, error: "db_error" };
    }

    return { deleted: count ?? ids.length };
  } catch (err) {
    logger.error("bulkDeleteContacts exception:", err);
    return { deleted: 0, error: "unexpected" };
  }
}
