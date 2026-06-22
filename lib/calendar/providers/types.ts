export interface CalendarProvider {
  readonly name: string;
  readonly displayName: string;
  getAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<TokenSet>;
  refreshAccessToken(refreshToken: string): Promise<TokenSet>;
  getConnectedEmail(accessToken: string): Promise<string>;
  listEvents(accessToken: string, options: EventListOptions): Promise<ProviderEvent[]>;
}

export type TokenSet = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope?: string;
};

export type EventListOptions = {
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
};

export type ProviderEvent = {
  providerEventId: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  organizerEmail?: string;
  organizerName?: string;
  location?: string;
  htmlLink?: string;
  status: "confirmed" | "tentative" | "cancelled";
  allDay: boolean;
};
