"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function disconnectCalendar(connectionId: string): Promise<boolean> {
  try {
    if (!connectionId) return false;

    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    // Verify ownership before delete
    const { data: connection } = await supabaseAdmin
      .from("calendar_connections")
      .select("id, provider, provider_account_email")
      .eq("id", connectionId)
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!connection) return false;

    // Delete connection — cascades to calendar_events
    const { error } = await supabaseAdmin
      .from("calendar_connections")
      .delete()
      .eq("id", connectionId);

    if (error) {
      logger.error("disconnectCalendar error:", error);
      return false;
    }

    const providerLabel =
      connection.provider === "google" ? "Google Calendar" : "Microsoft Calendar";
    const accountLabel = connection.provider_account_email
      ? ` (${connection.provider_account_email})`
      : "";

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "calendar_disconnected",
      title: "Calendar Disconnected",
      description: `${providerLabel} disconnected${accountLabel}`,
    });

    revalidatePath("/dashboard/calendar");

    return true;
  } catch (error) {
    logger.error("disconnectCalendar failed:", error);
    return false;
  }
}
