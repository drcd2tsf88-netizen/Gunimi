"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarEventRow } from "@/types/calendar";
import { logger } from "@/lib/logger";

const SELECT_FIELDS =
  "id, provider_event_id, title, description, start_at, end_at, organizer_email, organizer_name, location, html_link, status, all_day, contact_id, deal_id, company_id";

export async function getContactUpcomingMeetings(
  contactId: string,
  contactEmail: string | null
): Promise<CalendarEventRow[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const now = new Date().toISOString();

    // Primary: events explicitly linked to this contact
    const { data: linked, error: linkedError } = await supabaseAdmin
      .from("calendar_events")
      .select(SELECT_FIELDS)
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .neq("status", "cancelled")
      .gte("start_at", now)
      .order("start_at", { ascending: true })
      .limit(5);

    if (linkedError) {
      logger.error("getContactUpcomingMeetings linked error:", linkedError);
    }

    // Fallback: events where this contact is the organizer (synced from calendar)
    let byEmail: CalendarEventRow[] = [];
    if (contactEmail) {
      const { data: emailData, error: emailError } = await supabaseAdmin
        .from("calendar_events")
        .select(SELECT_FIELDS)
        .eq("workspace_id", workspace.id)
        .is("contact_id", null)
        .ilike("organizer_email", contactEmail)
        .neq("status", "cancelled")
        .gte("start_at", now)
        .order("start_at", { ascending: true })
        .limit(5);

      if (emailError) {
        logger.error("getContactUpcomingMeetings email error:", emailError);
      }
      byEmail = (emailData ?? []) as CalendarEventRow[];
    }

    const seen = new Set<string>();
    const merged: CalendarEventRow[] = [];
    for (const ev of [...(linked ?? []), ...byEmail]) {
      if (!seen.has(ev.id)) {
        seen.add(ev.id);
        merged.push(ev);
      }
    }

    return merged
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
      .slice(0, 5);
  } catch (err) {
    logger.error("getContactUpcomingMeetings failed:", err);
    return [];
  }
}
