"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CalendarConnection } from "@/types/calendar";

export async function getCalendarConnections(): Promise<CalendarConnection[]> {
  try {
    const user = await getUser();
    if (!user) return [];

    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("calendar_connections")
      .select("id, provider, provider_account_email, connected_at, last_synced_at")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });

    if (error) {
      console.error("getCalendarConnections error:", error);
      return [];
    }

    return (data ?? []) as CalendarConnection[];
  } catch (error) {
    console.error("getCalendarConnections failed:", error);
    return [];
  }
}
