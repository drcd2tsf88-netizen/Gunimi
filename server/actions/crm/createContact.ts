"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { createAuditLog } from "@/lib/server/audit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sanitize } from "@/lib/server/sanitize";
import { executeAutomations } from "@/lib/automation/engine";
import { logger } from "@/lib/logger";

type CreateContactProps = {
  name: string;
  email?: string;
  phone?: string;
};

export async function createContact({ name, email, phone }: CreateContactProps) {
  try {
    const supabase = await createClient();

    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit(user.id)) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const cleanName = sanitize(name);
    if (!cleanName) return null;

    const cleanEmail = email ? sanitize(email) : null;
    const cleanPhone = phone ? sanitize(phone) : null;

    const { data, error } = await supabase
      .from("workspace_contacts")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        assigned_to: user.id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        status: "lead",
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      logger.error("[createContact]", error);
      return null;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      contact_id: data.id,
      type: "contact_created",
      title: "Contact Created",
      description: `Created contact "${cleanName}"`,
    });

    await createAuditLog({
      workspace_id: workspace.id,
      user_id: user.id,
      action: "crm_contact_created",
      entity: "crm_contact",
      metadata: {
        contactId: data.id,
        name: cleanName,
        email: cleanEmail,
      },
    });

    await executeAutomations("contact.created", {
      workspaceId: workspace.id,
      userId: user.id,
      contactId: data.id,
      contactName: cleanName,
    });

    revalidatePath("/dashboard/contacts");

    return data;
  } catch (error) {
    logger.error("[createContact]", error);
    return null;
  }
}
