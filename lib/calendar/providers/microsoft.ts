import type {
  CalendarProvider,
  CreateEventInput,
  EventListOptions,
  ProviderEvent,
  TokenSet,
  UpdateEventInput,
} from "./types";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0/me";
const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MS_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

const SCOPES = [
  "Calendars.ReadWrite",
  "User.Read",
  "offline_access",
];

type GraphEvent = {
  id: string;
  subject: string | null;
  bodyPreview: string | null;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  organizer: { emailAddress: { address: string; name: string } } | null;
  location: { displayName: string } | null;
  webLink: string | null;
  showAs: string | null;
  isAllDay: boolean;
  isCancelled: boolean;
};

export class MicrosoftCalendarProvider implements CalendarProvider {
  readonly name = "microsoft";
  readonly displayName = "Outlook Calendar";

  private get clientId(): string {
    return process.env.MICROSOFT_CLIENT_ID!;
  }

  private get clientSecret(): string {
    return process.env.MICROSOFT_CLIENT_SECRET!;
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/callback/microsoft`;
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
      response_mode: "query",
      prompt: "select_account",
      state,
    });
    return `${MS_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<TokenSet> {
    const res = await fetch(MS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
        scope: SCOPES.join(" "),
      }).toString(),
    });
    if (!res.ok) throw new Error(`MS Calendar token exchange failed: ${await res.text()}`);
    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    const res = await fetch(MS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "refresh_token",
        scope: SCOPES.join(" "),
      }).toString(),
    });
    if (!res.ok) throw new Error(`MS Calendar token refresh failed: ${await res.text()}`);
    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
    };
  }

  async getConnectedEmail(accessToken: string): Promise<string> {
    const res = await fetch(`${GRAPH_BASE}?$select=mail,userPrincipalName`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch MS user info");
    const data = await res.json();
    return ((data.mail ?? data.userPrincipalName ?? "") as string).toLowerCase();
  }

  async listEvents(accessToken: string, options: EventListOptions): Promise<ProviderEvent[]> {
    const params = new URLSearchParams({
      $select: "id,subject,bodyPreview,start,end,organizer,location,webLink,showAs,isAllDay,isCancelled",
      $top: String(options.maxResults ?? 100),
      $orderby: "start/dateTime asc",
    });

    if (options.timeMin) {
      params.set("startDateTime", options.timeMin.toISOString());
    }
    if (options.timeMax) {
      params.set("endDateTime", options.timeMax.toISOString());
    }

    const res = await fetch(
      `${GRAPH_BASE}/calendarView?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}`, Prefer: 'outlook.timezone="UTC"' } }
    );

    if (!res.ok) throw new Error(`MS Calendar listEvents failed: ${await res.text()}`);

    const data = await res.json();
    const events: GraphEvent[] = data.value ?? [];

    return events
      .filter((e) => !e.isCancelled)
      .map((e) => {
        const startAt = new Date(e.start.dateTime + (e.start.dateTime.endsWith("Z") ? "" : "Z"));
        const endAt = new Date(e.end.dateTime + (e.end.dateTime.endsWith("Z") ? "" : "Z"));
        return {
          providerEventId: e.id,
          title: e.subject ?? "(No title)",
          description: e.bodyPreview ?? undefined,
          startAt,
          endAt,
          organizerEmail: e.organizer?.emailAddress.address ?? undefined,
          organizerName: e.organizer?.emailAddress.name ?? undefined,
          location: e.location?.displayName ?? undefined,
          htmlLink: e.webLink ?? undefined,
          status: e.isCancelled ? "cancelled" : e.showAs === "tentative" ? "tentative" : "confirmed",
          allDay: e.isAllDay,
        } satisfies ProviderEvent;
      });
  }

  async createEvent(accessToken: string, input: CreateEventInput): Promise<ProviderEvent> {
    const body = {
      subject: input.title,
      start: { dateTime: input.startAt.toISOString(), timeZone: "UTC" },
      end: { dateTime: input.endAt.toISOString(), timeZone: "UTC" },
      ...(input.description ? { body: { contentType: "text", content: input.description } } : {}),
      ...(input.location ? { location: { displayName: input.location } } : {}),
    };

    const res = await fetch(`${GRAPH_BASE}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`MS Calendar createEvent failed: ${await res.text()}`);
    const e: GraphEvent = await res.json();

    return {
      providerEventId: e.id,
      title: e.subject ?? input.title,
      startAt: new Date(e.start.dateTime + "Z"),
      endAt: new Date(e.end.dateTime + "Z"),
      htmlLink: e.webLink ?? undefined,
      status: "confirmed",
      allDay: e.isAllDay,
    };
  }

  async updateEvent(accessToken: string, input: UpdateEventInput): Promise<ProviderEvent> {
    const body: Record<string, unknown> = {};
    if (input.title) body.subject = input.title;
    if (input.startAt) body.start = { dateTime: input.startAt.toISOString(), timeZone: "UTC" };
    if (input.endAt) body.end = { dateTime: input.endAt.toISOString(), timeZone: "UTC" };
    if (input.description) body.body = { contentType: "text", content: input.description };

    const res = await fetch(`${GRAPH_BASE}/events/${input.providerEventId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`MS Calendar updateEvent failed: ${await res.text()}`);
    const e: GraphEvent = await res.json();

    return {
      providerEventId: e.id,
      title: e.subject ?? "",
      startAt: new Date(e.start.dateTime + "Z"),
      endAt: new Date(e.end.dateTime + "Z"),
      status: "confirmed",
      allDay: e.isAllDay,
    };
  }

  async deleteEvent(accessToken: string, providerEventId: string): Promise<void> {
    const res = await fetch(`${GRAPH_BASE}/events/${providerEventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok && res.status !== 404) {
      throw new Error(`MS Calendar deleteEvent failed: ${await res.text()}`);
    }
  }
}
