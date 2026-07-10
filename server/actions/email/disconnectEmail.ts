"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function disconnectEmail(connectionId: string): Promise<boolean> {
  const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
  if (!user || !workspace) return false;

  // Verify ownership before deleting
  const { data: connection, error: fetchError } = await supabaseAdmin
    .from("email_connections")
    .select("id, provider_account_email")
    .eq("id", connectionId)
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !connection) return false;

  const { error: deleteError } = await supabaseAdmin
    .from("email_connections")
    .delete()
    .eq("id", connectionId);

  if (deleteError) {
    logger.error("disconnectEmail error:", deleteError);
    return false;
  }

  await supabaseAdmin.from("workspace_activity").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    type: "email_disconnected",
    title: "Email Disconnected",
    description: `Disconnected email account ${connection.provider_account_email}`,
  });

  revalidatePath("/dashboard/email");
  return true;
}
