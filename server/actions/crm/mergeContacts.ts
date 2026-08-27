"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export type MergeContactResult =
  | { success: true; primaryId: string }
  | { success: false; error: string };

export async function mergeContacts(
  primaryId: string,
  secondaryId: string
): Promise<MergeContactResult> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthenticated" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    const supabase = await createClient();

    const [{ data: primary }, { data: secondary }] = await Promise.all([
      supabase
        .from("workspace_people")
        .select("*")
        .eq("id", primaryId)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),
      supabase
        .from("workspace_people")
        .select("*")
        .eq("id", secondaryId)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),
    ]);

    if (!primary || !secondary) {
      return { success: false, error: "not_found" };
    }

    // Primary always wins. Only fill truly empty primary fields from secondary.
    const mergedFields = {
      email: primary.email || secondary.email,
      phone: primary.phone || secondary.phone,
      position: primary.position || secondary.position,
      company_id: primary.company_id || secondary.company_id,
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

    // Merge tags: copy secondary tags to primary (ignore duplicates)
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

    // Update primary contact — only fill empty fields, never overwrite existing data
    await supabaseAdmin
      .from("workspace_people")
      .update({ ...mergedFields, updated_at: new Date().toISOString() })
      .eq("id", primaryId)
      .eq("workspace_id", workspace.id);

    // Delete secondary (ON DELETE SET NULL cleans remaining nullables)
    await supabaseAdmin
      .from("workspace_people")
      .delete()
      .eq("id", secondaryId)
      .eq("workspace_id", workspace.id);

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
