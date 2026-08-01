"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export type MergeContactFieldChoices = {
  email?: "primary" | "secondary";
  phone?: "primary" | "secondary";
  position?: "primary" | "secondary";
  company_id?: "primary" | "secondary";
};

export type MergeContactResult =
  | { success: true; primaryId: string }
  | { success: false; error: string };

export async function mergeContacts(
  primaryId: string,
  secondaryId: string,
  fieldChoices: MergeContactFieldChoices = {}
): Promise<MergeContactResult> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthenticated" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    const supabase = await createClient();

    // Load both contacts
    const [{ data: primary }, { data: secondary }] = await Promise.all([
      supabase
        .from("workspace_contacts")
        .select("*")
        .eq("id", primaryId)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),
      supabase
        .from("workspace_contacts")
        .select("*")
        .eq("id", secondaryId)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),
    ]);

    if (!primary || !secondary) {
      return { success: false, error: "not_found" };
    }

    // Resolve field values — primary wins unless user chose secondary or primary is empty
    function resolve<T>(field: keyof MergeContactFieldChoices, primaryVal: T, secondaryVal: T): T {
      if (fieldChoices[field] === "secondary") return secondaryVal;
      return primaryVal ?? secondaryVal;
    }

    const mergedFields = {
      email: resolve("email", primary.email, secondary.email),
      phone: resolve("phone", primary.phone, secondary.phone),
      position: resolve("position", primary.position, secondary.position),
      company_id: resolve("company_id", primary.company_id, secondary.company_id),
    };

    // Re-link all FK references: secondary → primary
    await Promise.all([
      supabaseAdmin
        .from("workspace_notes")
        .update({ contact_id: primaryId })
        .eq("contact_id", secondaryId)
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_tasks")
        .update({ contact_id: primaryId })
        .eq("contact_id", secondaryId)
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_activity")
        .update({ contact_id: primaryId })
        .eq("contact_id", secondaryId)
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_deals")
        .update({ contact_id: primaryId })
        .eq("contact_id", secondaryId)
        .eq("workspace_id", workspace.id),
    ]);

    // Merge tags: copy secondary tags to primary (upsert, ignore duplicates)
    const { data: secondaryTags } = await supabaseAdmin
      .from("workspace_entity_tags")
      .select("tag_id")
      .eq("entity_type", "contact")
      .eq("entity_id", secondaryId)
      .eq("workspace_id", workspace.id);

    if (secondaryTags?.length) {
      const tagRows = secondaryTags.map((t) => ({
        workspace_id: workspace.id,
        tag_id: t.tag_id,
        entity_type: "contact" as const,
        entity_id: primaryId,
      }));
      await supabaseAdmin
        .from("workspace_entity_tags")
        .upsert(tagRows, { onConflict: "workspace_id,tag_id,entity_type,entity_id", ignoreDuplicates: true });
    }

    // Update primary contact with merged field values
    await supabaseAdmin
      .from("workspace_contacts")
      .update({ ...mergedFields, updated_at: new Date().toISOString() })
      .eq("id", primaryId)
      .eq("workspace_id", workspace.id);

    // Delete secondary (ON DELETE SET NULL cleans remaining nullables)
    await supabaseAdmin
      .from("workspace_contacts")
      .delete()
      .eq("id", secondaryId)
      .eq("workspace_id", workspace.id);

    // Log merge activity
    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      contact_id: primaryId,
      type: "contact_merged",
      title: "Contacts Merged",
      description: `Merged "${secondary.name}" into "${primary.name}"`,
    });

    revalidatePath("/dashboard/contacts");
    revalidatePath(`/dashboard/contacts/${primaryId}`);

    return { success: true, primaryId };
  } catch (err) {
    logger.error("mergeContacts error:", err);
    return { success: false, error: "unexpected" };
  }
}
