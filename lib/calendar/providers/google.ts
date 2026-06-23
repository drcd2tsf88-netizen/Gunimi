import type {
  CalendarProvider,
  EventListOptions,
  ProviderEvent,
  TokenSet,
} from "./types";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
const GOOGLE_CALENDAR_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export class GoogleCalendarProvider implements CalendarProvider {
  readonly name = "google";
  readonly displayName = "Google Calendar";

  private get clientId(): string {
    return process.env.GOOGLE_CLIENT_ID!;
  }

  private get clientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET!;
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/callback/google`;
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<TokenSet> {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google token exchange failed: ${err}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "refresh_token",
      }).toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google token refresh failed: ${err}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
    };
  }

  async getConnectedEmail(accessToken: string): Promise<string> {
    const res = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw new Error("Failed to fetch Google user info");

    const data = await res.json();
    return data.email as string;
  }

  async listEvents(
    accessToken: string,
    options: EventListOptions
  ): Promise<ProviderEvent[]> {
    const params = new URLSearchParams({
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: String(options.maxResults ?? 100),
    });

    if (options.timeMin) params.set("timeMin", options.timeMin.toISOString());
    if (options.timeMax) params.set("timeMax", options.timeMax.toISOString());

    const res = await fetch(
      `${GOOGLE_CALENDAR_URL}?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Calendar listEvents failed: ${err}`);
    }

    const data = await res.json();
    const items: Record<string, unknown>[] = data.items ?? [];

    return items.map((item) => {
      const start = item.start as Record<string, string> | undefined;
      const end = item.end as Record<string, string> | undefined;
      const organizer = item.organizer as Record<string, string> | undefined;
      const allDay = Boolean(start?.date && !start?.dateTime);
      const status = item.status as "confirmed" | "tentative" | "cancelled";

      return {
        providerEventId: String(item.id),
        title: String(item.summary ?? "Untitled Event"),
        description: item.description ? String(item.description) : undefined,
        startAt: start?.dateTime
          ? new Date(start.dateTime)
          : new Date(start?.date ?? ""),
        endAt: end?.dateTime
          ? new Date(end.dateTime)
          : new Date(end?.date ?? ""),
        organizerEmail: organizer?.email,
        organizerName: organizer?.displayName,
        location: item.location ? String(item.location) : undefined,
        htmlLink: item.htmlLink ? String(item.htmlLink) : undefined,
        status: status ?? "confirmed",
        allDay,
      };
    });
  }
}
