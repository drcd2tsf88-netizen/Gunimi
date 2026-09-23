"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarEventRow } from "@/types/calendar";
import { logger } from "@/lib/logger";

const SELECT_FIELDS =
  "id, provider_event_id, title, description, start_at, end_at, organizer_email, organizer_name, location, html_link, status, all_day, contact_id, deal_id, company_id";

export async function getTodayMeetings(): Promise<CalendarEventRow[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .select(SELECT_FIELDS)
      .eq("workspace_id", workspace.id)
      .neq("status", "cancelled")
      .gte("start_at", startOfDay)
      .lte("start_at", endOfDay)
      .order("start_at", { ascending: true })
      .limit(10);

    if (error) {
      logger.error("getTodayMeetings error:", error);
      return [];
    }

    return (data ?? []) as CalendarEventRow[];
  } catch (err) {
    logger.error("getTodayMeetings failed:", err);
    return [];
  }
}
