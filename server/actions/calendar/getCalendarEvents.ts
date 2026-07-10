"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarEventRow } from "@/types/calendar";
import { logger } from "@/lib/logger";

export async function getCalendarEvents(limit = 20): Promise<CalendarEventRow[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .select(
        "id, title, description, start_at, end_at, organizer_email, organizer_name, location, html_link, status, all_day"
      )
      .eq("workspace_id", workspace.id)
      .neq("status", "cancelled")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(limit);

    if (error) {
      logger.error("getCalendarEvents error:", error);
      return [];
    }

    return (data ?? []) as CalendarEventRow[];
  } catch (error) {
    logger.error("getCalendarEvents failed:", error);
    return [];
  }
}
