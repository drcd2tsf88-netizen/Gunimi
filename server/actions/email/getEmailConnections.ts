"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import type { EmailConnection } from "@/types/email";
import { logger } from "@/lib/logger";

export async function getEmailConnections(): Promise<EmailConnection[]> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("email_connections")
      .select("id, provider, provider_account_email, connected_at, last_synced_at")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });

    if (error) {
      logger.error("getEmailConnections error:", error);
      return [];
    }

    return (data ?? []) as EmailConnection[];
  } catch (error) {
    logger.error("getEmailConnections failed:", error);
    return [];
  }
}
