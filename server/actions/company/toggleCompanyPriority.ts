"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function toggleCompanyPriority(companyId: string, isPriority: boolean): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_companies")
      .update({ is_priority: isPriority, last_activity_at: new Date().toISOString() })
      .eq("workspace_id", workspace.id)
      .eq("id", companyId);

    if (error) {
      logger.error(error);
      return false;
    }

    revalidatePath("/dashboard/companies");
    revalidatePath(`/dashboard/companies/${companyId}`);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}
