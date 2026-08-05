import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "@/lib/calendar/providers";
import { logger } from "@/lib/logger";

type TokenResult = {
  accessToken: string;
  connectionId: string;
};

export async function getWorkspaceAccessToken(
  workspaceId: string,
  userId?: string
): Promise<TokenResult | null> {
  const query = supabaseAdmin
    .from("calendar_connections")
    .select("id, provider, access_token, refresh_token, token_expires_at")
    .eq("workspace_id", workspaceId)
    .order("connected_at", { ascending: false })
    .limit(1);

  if (userId) query.eq("user_id", userId);

  const { data: connection, error } = await query.maybeSingle();

  if (error || !connection) return null;

  let accessToken = connection.access_token as string;
  const connectionId = connection.id as string;

  if (
    connection.refresh_token &&
    connection.token_expires_at &&
    new Date(connection.token_expires_at as string) < new Date(Date.now() + 60 * 1000)
  ) {
    try {
      const provider = getProvider(connection.provider as string);
      const tokens = await provider.refreshAccessToken(connection.refresh_token as string);
      accessToken = tokens.accessToken;

      await supabaseAdmin
        .from("calendar_connections")
        .update({
          access_token: tokens.accessToken,
          token_expires_at: tokens.expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);
    } catch (err) {
      logger.error("getWorkspaceAccessToken refresh failed:", err);
      return null;
    }
  }

  if (!accessToken) return null;

  return { accessToken, connectionId };
}
