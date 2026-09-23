"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarEventRow } from "@/types/calendar";
import { logger } from "@/lib/logger";

const SELECT_FIELDS =
  "id, provider_event_id, title, description, start_at, end_at, organizer_email, organizer_name, location, html_link, status, all_day, contact_id, deal_id, company_id";

export async function getCompanyUpcomingMeetings(companyId: string): Promise<CalendarEventRow[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .select(SELECT_FIELDS)
      .eq("workspace_id", workspace.id)
      .eq("company_id", companyId)
      .neq("status", "cancelled")
      .gte("start_at", now)
      .order("start_at", { ascending: true })
      .limit(5);

    if (error) {
      logger.error("getCompanyUpcomingMeetings error:", error);
      return [];
    }

    return (data ?? []) as CalendarEventRow[];
  } catch (err) {
    logger.error("getCompanyUpcomingMeetings failed:", err);
    return [];
  }
}
