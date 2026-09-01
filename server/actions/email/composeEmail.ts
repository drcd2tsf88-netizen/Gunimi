"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "@/lib/email/providers";
import { getValidAccessToken } from "@/lib/email/getValidAccessToken";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

type ComposeResult = { ok: true; messageId: string } | { ok: false; error: string };

export async function composeEmail(
  to: string,
  subject: string,
  body: string,
  contactId?: string
): Promise<ComposeResult> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) return { ok: false, error: "unauthorized" };

    const { data: connection } = await supabaseAdmin
      .from("email_connections")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!connection) return { ok: false, error: "no_connection" };

    const tokenData = await getValidAccessToken(connection.id);
    if (!tokenData) return { ok: false, error: "no_token" };

    const { connection: conn, accessToken } = tokenData;

    if (!conn.scope?.includes("gmail.send")) {
      return { ok: false, error: "reconnect_required" };
    }

    const provider = getProvider(conn.provider);
    const messageId = await provider.sendMessage(accessToken, {
      from: conn.provider_account_email,
      to,
      subject,
      body,
    });

    // Trigger signal if linked to a contact
    if (contactId) {
      void supabaseAdmin.from("signals").insert({
        workspace_id: workspace.id,
        type: "email_sent",
        entity_type: "contact",
        entity_id: contactId,
        title: `Email sent: ${subject}`,
        status: "active",
        priority: "low",
      });
    }

    return { ok: true, messageId };
  } catch (err) {
    logger.error("composeEmail failed:", err);
    return { ok: false, error: "unknown" };
  }
}
