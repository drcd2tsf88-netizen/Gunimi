"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type CancelCalendarEventResult =
  | { success: true }
  | { success: false; error: string };

export async function cancelCalendarEvent(
  eventId: string,
  providerEventId: string,
  contactId?: string | null,
  dealId?: string | null,
  companyId?: string | null
): Promise<CancelCalendarEventResult> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "unauthenticated" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    const tokenResult = await getWorkspaceAccessToken(workspace.id, user.id);
    if (!tokenResult) return { success: false, error: "no_calendar_connection" };

    const { data: connection } = await supabaseAdmin
      .from("calendar_connections")
      .select("provider")
      .eq("id", tokenResult.connectionId)
      .maybeSingle();

    const provider = getProvider(connection?.provider ?? "google");

    try {
      await provider.deleteEvent(tokenResult.accessToken, providerEventId);
    } catch (apiErr) {
      const detail = apiErr instanceof Error ? apiErr.message : String(apiErr);
      logger.error("cancelCalendarEvent Google API error:", detail);
      if (detail.includes("403") || detail.toLowerCase().includes("insufficient")) {
        return { success: false, error: "insufficient_scope" };
      }
      return { success: false, error: "google_api_error" };
    }

    const { error: dbErr } = await supabaseAdmin
      .from("calendar_events")
      .update({ status: "cancelled" })
      .eq("id", eventId)
      .eq("workspace_id", workspace.id);

    if (dbErr) logger.error("cancelCalendarEvent DB error:", dbErr);

    revalidatePath("/dashboard/calendar");
    if (contactId) revalidatePath(`/dashboard/contacts/${contactId}`);
    if (dealId) revalidatePath(`/dashboard/deals/${dealId}`);
    if (companyId) revalidatePath(`/dashboard/companies/${companyId}`);

    return { success: true };
  } catch (err) {
    logger.error("cancelCalendarEvent failed:", err);
    return { success: false, error: "unknown" };
  }
}
