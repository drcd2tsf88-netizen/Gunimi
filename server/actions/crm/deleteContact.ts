"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function deleteContact(contactId: string) {
  try {
    if (!contactId) return false;

    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    // Fetch to verify workspace ownership and capture name for activity
    const { data: contact, error: fetchError } = await supabase
      .from("workspace_contacts")
      .select("id, name, company_id")
      .eq("workspace_id", workspace.id)
      .eq("id", contactId)
      .maybeSingle();

    if (fetchError || !contact) {
      logger.error(fetchError);
      return false;
    }

    // DELETE via supabaseAdmin — no DELETE RLS policy exists for workspace_contacts
    const { error: deleteError } = await supabaseAdmin
      .from("workspace_contacts")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("id", contactId);

    if (deleteError) {
      logger.error(deleteError);
      return false;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      company_id: contact.company_id || null,
      contact_id: contact.id,
      type: "contact_deleted",
      title: "Contact Deleted",
      description: `Deleted contact "${contact.name}"`,
    });

    revalidatePath("/dashboard/contacts");
    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}
