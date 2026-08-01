"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function toggleContactPriority(contactId: string, isPriority: boolean): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_contacts")
      .update({ is_priority: isPriority, updated_at: new Date().toISOString() })
      .eq("workspace_id", workspace.id)
      .eq("id", contactId);

    if (error) {
      logger.error(error);
      return false;
    }

    revalidatePath("/dashboard/contacts");
    revalidatePath(`/dashboard/contacts/${contactId}`);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}
