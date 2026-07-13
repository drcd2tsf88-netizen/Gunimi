"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import { produceContactSignals } from "@/lib/signals/producers/contactProducer";

export type UpdateContactProps = {
  contactId: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  notes?: string;
};

export async function updateContact({
  contactId,
  name,
  email,
  phone,
  position,
  notes,
}: UpdateContactProps) {
  try {
    if (!contactId || !name.trim()) return null;

    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit(user.id)) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_contacts")
      .update({
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        position: position?.trim() || null,
        notes: notes?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("workspace_id", workspace.id)
      .eq("id", contactId)
      .select()
      .maybeSingle();

    if (error || !data) {
      logger.error(error);
      return null;
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      company_id: data.company_id || null,
      contact_id: contactId,
      type: "contact_updated",
      title: "Contact Updated",
      description: `Updated contact "${name.trim()}"`,
    });

    await produceContactSignals({
      workspaceId: workspace.id,
      contactId,
      lastContactedAt: data.last_contacted_at ?? null,
      createdAt: data.created_at,
      email: data.email ?? null,
      phone: data.phone ?? null,
      companyId: data.company_id ?? null,
    });

    revalidatePath("/dashboard/contacts");
    revalidatePath(`/dashboard/contacts/${contactId}`);

    return data;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
