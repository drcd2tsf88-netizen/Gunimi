import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "./providers";
import { logger } from "@/lib/logger";

export type EmailConnectionRow = {
  id: string;
  workspace_id: string;
  user_id: string;
  provider: string;
  provider_account_email: string;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  scope: string | null;
};

export async function getValidAccessToken(
  connectionId: string
): Promise<{ connection: EmailConnectionRow; accessToken: string } | null> {
  const { data: connection } = await supabaseAdmin
    .from("email_connections")
    .select("*")
    .eq("id", connectionId)
    .maybeSingle();

  if (!connection?.access_token) return null;

  const provider = getProvider(connection.provider);
  let accessToken: string = connection.access_token;

  if (
    connection.token_expires_at &&
    new Date(connection.token_expires_at).getTime() < Date.now() + 60_000
  ) {
    if (!connection.refresh_token) return null;
    try {
      const refreshed = await provider.refreshAccessToken(connection.refresh_token);
      accessToken = refreshed.accessToken;
      await supabaseAdmin
        .from("email_connections")
        .update({
          access_token: refreshed.accessToken,
          token_expires_at: refreshed.expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);
    } catch (err) {
      logger.error("Token refresh failed for connection", connectionId, err);
      return null;
    }
  }

  return { connection: connection as EmailConnectionRow, accessToken };
}
