"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

const MS_PER_DAY = 86_400_000;

export type AIMeeting = {
  id: string;
  title: string;
  startAt: string;
  endAt: string | null;
  location: string | null;
  organizerName: string | null;
  allDay: boolean;
  isToday: boolean;
  daysUntil: number;
};

type RawMeetingRow = {
  id: string;
  title: string;
  start_at: string;
  end_at: string | null;
  location: string | null;
  organizer_name: string | null;
  all_day: boolean;
};

export async function getAIMeetings(daysAhead = 14): Promise<AIMeeting[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const now = new Date();
    const future = new Date(Date.now() + daysAhead * MS_PER_DAY);

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .select("id, title, start_at, end_at, location, organizer_name, all_day")
      .eq("workspace_id", workspace.id)
      .neq("status", "cancelled")
      .gte("start_at", now.toISOString())
      .lte("start_at", future.toISOString())
      .order("start_at", { ascending: true })
      .limit(25);

    if (error || !data) return [];

    const todayStr = now.toDateString();

    return (data as unknown as RawMeetingRow[]).map((m) => {
      const startMs = new Date(m.start_at).getTime();
      const daysUntil = Math.floor((startMs - now.getTime()) / MS_PER_DAY);
      return {
        id: m.id,
        title: m.title,
        startAt: m.start_at,
        endAt: m.end_at ?? null,
        location: m.location ?? null,
        organizerName: m.organizer_name ?? null,
        allDay: m.all_day ?? false,
        isToday: new Date(m.start_at).toDateString() === todayStr,
        daysUntil: Math.max(0, daysUntil),
      };
    });
  } catch {
    return [];
  }
}
