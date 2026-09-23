"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type UpdateCalendarEventInput = {
  eventId: string;
  providerEventId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  description?: string;
  location?: string;
  contactId?: string | null;
  dealId?: string | null;
  companyId?: string | null;
};

export type UpdateCalendarEventResult =
  | { success: true }
  | { success: false; error: string };

export async function updateCalendarEvent(
  input: UpdateCalendarEventInput
): Promise<UpdateCalendarEventResult> {
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

    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    try {
      await provider.updateEvent(tokenResult.accessToken, {
        providerEventId: input.providerEventId,
        title: input.title,
        startAt,
        endAt,
        description: input.description,
      });
    } catch (apiErr) {
      const detail = apiErr instanceof Error ? apiErr.message : String(apiErr);
      logger.error("updateCalendarEvent Google API error:", detail);
      if (detail.includes("403") || detail.toLowerCase().includes("insufficient")) {
        return { success: false, error: "insufficient_scope" };
      }
      return { success: false, error: "google_api_error" };
    }

    const { error: dbErr } = await supabaseAdmin
      .from("calendar_events")
      .update({
        title: input.title,
        description: input.description ?? null,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        location: input.location ?? null,
      })
      .eq("id", input.eventId)
      .eq("workspace_id", workspace.id);

    if (dbErr) logger.error("updateCalendarEvent DB error:", dbErr);

    revalidatePath("/dashboard/calendar");
    if (input.contactId) revalidatePath(`/dashboard/contacts/${input.contactId}`);
    if (input.dealId) revalidatePath(`/dashboard/deals/${input.dealId}`);
    if (input.companyId) revalidatePath(`/dashboard/companies/${input.companyId}`);

    return { success: true };
  } catch (err) {
    logger.error("updateCalendarEvent failed:", err);
    return { success: false, error: "unknown" };
  }
}
