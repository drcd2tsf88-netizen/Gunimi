"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

type MarkAsMetResult = { ok: true } | { ok: false; error: string };

export async function markAsMet(
  contactId: string,
  eventTitle: string
): Promise<MarkAsMetResult> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return { ok: false, error: "unauthorized" };

    const { error } = await supabaseAdmin.from("signals").insert({
      workspace_id: workspace.id,
      type: "meeting_held",
      entity_type: "contact",
      entity_id: contactId,
      title: `Meeting held: ${eventTitle}`,
      status: "active",
      priority: "medium",
    });

    if (error) {
      logger.error("markAsMet insert failed:", error);
      return { ok: false, error: "insert_failed" };
    }

    return { ok: true };
  } catch (err) {
    logger.error("markAsMet failed:", err);
    return { ok: false, error: "unknown" };
  }
}
