import type {
  EmailProvider,
  ProviderMessage,
  ProviderThreadDetail,
  ThreadListOptions,
  ThreadSummary,
  TokenSet,
} from "./types";

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const METADATA_HEADERS = ["From", "To", "Cc", "Subject", "Date"];

function extractEmail(header: string): string {
  const match = header.match(/<([^>]+)>/);
  return (match ? match[1] : header).trim().toLowerCase();
}

function extractName(header: string): string | undefined {
  const match = header.match(/^([^<]+)</);
  return match ? match[1].trim().replace(/^"|"$/g, "") : undefined;
}

function extractEmails(header: string): string[] {
  const matches = header.match(/[\w.+'-]+@[\w.-]+\.[a-zA-Z]{2,}/g);
  return (matches ?? []).map((e) => e.toLowerCase());
}

function getHeader(
  headers: Array<{ name: string; value: string }>,
  name: string
): string {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export class GmailProvider implements EmailProvider {
  readonly name = "gmail";
  readonly displayName = "Gmail";

  private get clientId(): string {
    return process.env.GOOGLE_CLIENT_ID!;
  }

  private get clientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET!;
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/gmail`;
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
      throw new Error(`Gmail token exchange failed: ${await res.text()}`);
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
      throw new Error(`Gmail token refresh failed: ${await res.text()}`);
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

    if (!res.ok) throw new Error("Failed to fetch Gmail user info");

    const data = await res.json();
    return (data.email as string).toLowerCase();
  }

  async listThreads(
    accessToken: string,
    options: ThreadListOptions = {}
  ): Promise<ThreadSummary[]> {
    const params = new URLSearchParams({
      maxResults: String(options.maxResults ?? 30),
    });

    if (options.afterDate) {
      const epoch = Math.floor(options.afterDate.getTime() / 1000);
      params.set("q", `after:${epoch}`);
    }

    const res = await fetch(`${GMAIL_BASE}/threads?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Gmail listThreads failed: ${await res.text()}`);
    }

    const data = await res.json();
    const threads: Array<{ id: string; historyId?: string }> = data.threads ?? [];

    return threads.map((t) => ({
      providerThreadId: t.id,
      historyId: t.historyId,
    }));
  }

  async getThreadDetail(
    accessToken: string,
    threadId: string
  ): Promise<ProviderThreadDetail | null> {
    const params = new URLSearchParams({ format: "metadata" });
    for (const h of METADATA_HEADERS) {
      params.append("metadataHeaders", h);
    }

    const res = await fetch(`${GMAIL_BASE}/threads/${threadId}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 404) return null;

    if (!res.ok) {
      throw new Error(`Gmail getThread ${threadId} failed: ${await res.text()}`);
    }

    const data = await res.json();
    const rawMessages: Array<Record<string, unknown>> = data.messages ?? [];

    const messages: ProviderMessage[] = rawMessages.map((msg) => {
      const headers: Array<{ name: string; value: string }> =
        ((msg.payload as Record<string, unknown>)?.headers as Array<{
          name: string;
          value: string;
        }>) ?? [];
      const labelIds: string[] = (msg.labelIds as string[]) ?? [];

      const fromHeader = getHeader(headers, "From");
      const toHeader = getHeader(headers, "To");
      const ccHeader = getHeader(headers, "Cc");
      const subjectHeader = getHeader(headers, "Subject");
      const dateHeader = getHeader(headers, "Date");

      const senderEmail = extractEmail(fromHeader);
      const senderName = extractName(fromHeader);
      const recipientEmails = toHeader ? extractEmails(toHeader) : [];
      const ccEmails = ccHeader ? extractEmails(ccHeader) : [];

      let sentAt: Date;
      try {
        const internalDate = msg.internalDate as string | undefined;
        sentAt = internalDate
          ? new Date(parseInt(internalDate, 10))
          : dateHeader
            ? new Date(dateHeader)
            : new Date();
      } catch {
        sentAt = new Date();
      }

      return {
        providerMessageId: String(msg.id),
        senderEmail,
        senderName,
        recipientEmails,
        ccEmails,
        subject: subjectHeader || undefined,
        snippet: (msg.snippet as string) || undefined,
        sentAt,
        isOutbound: false, // resolved in sync.ts against connection.provider_account_email
        isUnread: labelIds.includes("UNREAD"),
      };
    });

    const firstMsg = messages[0];
    const lastMsg = messages[messages.length - 1];

    return {
      providerThreadId: String(data.id),
      subject: firstMsg?.subject,
      snippet: lastMsg?.snippet ?? firstMsg?.snippet,
      messages,
      lastMessageAt: lastMsg?.sentAt ?? firstMsg?.sentAt,
      historyId: String(data.historyId ?? ""),
    };
  }
}
