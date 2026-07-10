import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getProvider } from "./providers";
import { logger } from "@/lib/logger";

export type SyncResult = {
  synced: number;
  connectionId: string;
};

function isRevokedTokenError(err: unknown): boolean {
  return String(err).includes("invalid_grant");
}

export async function syncCalendarConnection(
  connectionId: string
): Promise<SyncResult> {
  const { data: connection, error } = await supabaseAdmin
    .from("calendar_connections")
    .select("*")
    .eq("id", connectionId)
    .maybeSingle();

  if (error || !connection) {
    throw new Error(`Calendar connection not found: ${connectionId}`);
  }

  const provider = getProvider(connection.provider as string);
  let accessToken: string = connection.access_token as string;

  // Refresh token if it expires within 60 seconds
  if (
    connection.refresh_token &&
    connection.token_expires_at &&
    new Date(connection.token_expires_at as string) <
      new Date(Date.now() + 60 * 1000)
  ) {
    try {
      const tokens = await provider.refreshAccessToken(
        connection.refresh_token as string
      );
      accessToken = tokens.accessToken;

      await supabaseAdmin
        .from("calendar_connections")
        .update({
          access_token: tokens.accessToken,
          token_expires_at: tokens.expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);
    } catch (refreshError) {
      if (isRevokedTokenError(refreshError)) {
        logger.error(
          `[Calendar] Token revoked for connection ${connectionId} — clearing credentials`
        );
        await supabaseAdmin
          .from("calendar_connections")
          .update({
            access_token: null,
            refresh_token: null,
            token_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", connectionId);
      }
      throw refreshError;
    }
  }

  const timeMin = new Date();
  const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const events = await provider.listEvents(accessToken, {
    timeMin,
    timeMax,
    maxResults: 100,
  });

  if (events.length > 0) {
    const rows = events.map((e) => ({
      workspace_id: connection.workspace_id as string,
      connection_id: connectionId,
      provider_event_id: e.providerEventId,
      title: e.title,
      description: e.description ?? null,
      start_at: e.startAt.toISOString(),
      end_at: e.endAt.toISOString(),
      organizer_email: e.organizerEmail ?? null,
      organizer_name: e.organizerName ?? null,
      location: e.location ?? null,
      html_link: e.htmlLink ?? null,
      status: e.status,
      all_day: e.allDay,
      synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await supabaseAdmin
      .from("calendar_events")
      .upsert(rows, { onConflict: "connection_id,provider_event_id" });
  }

  await supabaseAdmin
    .from("calendar_connections")
    .update({
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);

  return { synced: events.length, connectionId };
}
