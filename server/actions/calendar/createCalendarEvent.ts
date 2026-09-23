"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { produceSignal } from "@/lib/signals/engine";

export type CreateCalendarEventInput = {
  title: string;
  startAt: Date;
  endAt: Date;
  description?: string;
  location?: string;
  contactId?: string;
  dealId?: string;
  companyId?: string;
};

export type CreateCalendarEventResult =
  | { success: true; eventId: string; htmlLink: string | null }
  | { success: false; error: string; detail?: string };

export async function createCalendarEvent(
  input: CreateCalendarEventInput
): Promise<CreateCalendarEventResult> {
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

    // Defensive: ensure Date objects (server actions may deserialize as strings)
    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    let event;
    try {
      event = await provider.createEvent(tokenResult.accessToken, {
        title: input.title,
        startAt,
        endAt,
        description: input.description,
        location: input.location,
      });
    } catch (apiErr) {
      const detail = apiErr instanceof Error ? apiErr.message : String(apiErr);
      logger.error("createCalendarEvent Google API error:", detail);
      if (detail.includes("403") || detail.toLowerCase().includes("insufficient")) {
        return { success: false, error: "insufficient_scope" };
      }
      if (detail.includes("401")) {
        return { success: false, error: "token_expired" };
      }
      return { success: false, error: "google_api_error", detail };
    }

    const { error: insertError } = await supabaseAdmin.from("calendar_events").insert({
      workspace_id: workspace.id,
      connection_id: tokenResult.connectionId,
      provider_event_id: event.providerEventId,
      title: event.title,
      description: event.description ?? null,
      start_at: event.startAt.toISOString(),
      end_at: event.endAt.toISOString(),
      organizer_email: event.organizerEmail ?? null,
      organizer_name: event.organizerName ?? null,
      location: event.location ?? null,
      html_link: event.htmlLink ?? null,
      status: event.status,
      all_day: event.allDay,
      contact_id: input.contactId ?? null,
      deal_id: input.dealId ?? null,
      company_id: input.companyId ?? null,
    });

    if (insertError) {
      logger.error("createCalendarEvent DB insert error:", insertError);
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "calendar_event_created",
      title: "Meeting scheduled",
      description: input.title,
      contact_id: input.contactId ?? null,
      deal_id: input.dealId ?? null,
    });

    // Produce meeting_approaching signal for the linked contact or deal
    if (input.contactId) {
      await produceSignal({
        workspaceId: workspace.id,
        type: "meeting_approaching",
        entityType: "contact",
        entityId: input.contactId,
        confidence: "high",
        evidenceData: { title: event.title },
        producedBy: "task_engine",
        origin: "calendar_create",
        expiresAt: endAt.toISOString(),
      }).catch((err) => logger.error("createCalendarEvent signal error:", err));
    } else if (input.dealId) {
      await produceSignal({
        workspaceId: workspace.id,
        type: "meeting_approaching",
        entityType: "deal",
        entityId: input.dealId,
        confidence: "high",
        evidenceData: { title: event.title },
        producedBy: "task_engine",
        origin: "calendar_create",
        expiresAt: endAt.toISOString(),
      }).catch((err) => logger.error("createCalendarEvent signal error:", err));
    }

    revalidatePath("/dashboard/calendar");
    if (input.contactId) revalidatePath(`/dashboard/contacts/${input.contactId}`);
    if (input.dealId) revalidatePath(`/dashboard/deals/${input.dealId}`);

    return { success: true, eventId: event.providerEventId, htmlLink: event.htmlLink ?? null };
  } catch (err) {
    logger.error("createCalendarEvent failed:", err);
    return { success: false, error: "unknown" };
  }
}
