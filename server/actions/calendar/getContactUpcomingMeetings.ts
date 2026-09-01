"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarEventRow } from "@/types/calendar";
import { logger } from "@/lib/logger";

export async function getContactUpcomingMeetings(
  contactEmail: string | null
): Promise<CalendarEventRow[]> {
  if (!contactEmail) return [];

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .select(
        "id, provider_event_id, title, description, start_at, end_at, organizer_email, organizer_name, location, html_link, status, all_day"
      )
      .eq("workspace_id", workspace.id)
      .ilike("organizer_email", contactEmail)
      .neq("status", "cancelled")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(5);

    if (error) {
      logger.error("getContactUpcomingMeetings error:", error);
      return [];
    }

    return (data ?? []) as CalendarEventRow[];
  } catch (err) {
    logger.error("getContactUpcomingMeetings failed:", err);
    return [];
  }
}
