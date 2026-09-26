// Signal Scanner — Meeting
//
// Evaluates upcoming calendar events linked to CRM contacts.
// Delegates to produceMeetingSignals() — no signal evaluation duplication.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceMeetingSignals } from "@/lib/signals/producers/meetingProducer";
import type { ScanContext, ScanResult } from "../types";

type CalendarEventRow = {
  id: string;
  contact_id: string;
  start_at: string;
};

// Scan window: events starting within the next 48 h (covers both signal types)
const SCAN_WINDOW_HOURS = 48;

export async function meetingScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  const now = new Date().toISOString();
  const windowEnd = new Date(Date.now() + SCAN_WINDOW_HOURS * 3_600_000).toISOString();

  let query = supabaseAdmin
    .from("calendar_events")
    .select("id, contact_id, start_at")
    .eq("workspace_id", context.workspaceId)
    .neq("status", "cancelled")
    .not("contact_id", "is", null)
    .gte("start_at", now)
    .lte("start_at", windowEnd)
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const events = (data ?? []) as CalendarEventRow[];

  if (events.length === 0) {
    return {
      scanType: "meeting_scan",
      workspaceId: context.workspaceId,
      entitiesScanned: 0,
      signalsProduced: 0,
      signalsResolved: 0,
      completed: true,
      nextCursor: null,
      durationMs: Date.now() - startMs,
    };
  }

  let signalsProduced = 0;
  let signalsResolved = 0;
  let lastId = context.cursor;

  for (const event of events) {
    if (context.signal?.aborted) break;

    const stats = await produceMeetingSignals({
      workspaceId: context.workspaceId,
      eventId: event.id,
      contactId: event.contact_id,
      startAt: event.start_at,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    lastId = event.id;
  }

  const completed = events.length < context.batchSize;

  return {
    scanType: "meeting_scan",
    workspaceId: context.workspaceId,
    entitiesScanned: events.length,
    signalsProduced,
    signalsResolved,
    completed,
    nextCursor: completed ? null : lastId,
    durationMs: Date.now() - startMs,
  };
}
