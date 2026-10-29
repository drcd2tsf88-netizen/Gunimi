import type {
  EmailProvider,
  ProviderMessage,
  ProviderThreadDetail,
  SendMessageOptions,
  ThreadListOptions,
  ThreadSummary,
  TokenSet,
} from "./types";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0/me";
const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MS_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

const SCOPES = [
  "Mail.Read",
  "Mail.Send",
  "Calendars.Read",
  "User.Read",
  "Chat.Read",
  "Chat.ReadBasic",
  "offline_access",
];

const MESSAGE_SELECT = [
  "id",
  "conversationId",
  "subject",
  "bodyPreview",
  "from",
  "toRecipients",
  "ccRecipients",
  "receivedDateTime",
  "isRead",
  "isDraft",
].join(",");

type GraphMessage = {
  id: string;
  conversationId: string;
  subject: string | null;
  bodyPreview: string | null;
  from: { emailAddress: { address: string; name?: string } } | null;
  toRecipients: Array<{ emailAddress: { address: string } }>;
  ccRecipients: Array<{ emailAddress: { address: string } }>;
  receivedDateTime: string;
  isRead: boolean;
  isDraft: boolean;
};

export class OutlookProvider implements EmailProvider {
  readonly name = "microsoft365";
  readonly displayName = "Outlook";

  private get clientId(): string {
    return process.env.MICROSOFT_CLIENT_ID!;
  }

  private get clientSecret(): string {
    return process.env.MICROSOFT_CLIENT_SECRET!;
  }

  private get redirectUri(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/email/callback/outlook`;
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

    if (!res.ok) throw new Error(`Outlook token exchange failed: ${await res.text()}`);

    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope ?? SCOPES.join(" "),
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

    if (!res.ok) throw new Error(`Outlook token refresh failed: ${await res.text()}`);

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

    if (!res.ok) throw new Error("Failed to fetch Outlook user info");

    const data = await res.json();
    const email: string = data.mail ?? data.userPrincipalName ?? "";
    return email.toLowerCase();
  }

  async listThreads(
    accessToken: string,
    options: ThreadListOptions = {}
  ): Promise<ThreadSummary[]> {
    const top = options.maxResults ?? 30;
    const params = new URLSearchParams({
      $select: MESSAGE_SELECT,
      $top: String(top * 3), // fetch more to allow dedup by conversationId
      $orderby: "receivedDateTime desc",
    });

    if (options.afterDate) {
      params.set(
        "$filter",
        `receivedDateTime ge ${options.afterDate.toISOString()}`
      );
    }

    const res = await fetch(`${GRAPH_BASE}/mailFolders/inbox/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}`, ConsistencyLevel: "eventual" },
    });

    if (!res.ok) throw new Error(`Outlook listThreads failed: ${await res.text()}`);

    const data = await res.json();
    const messages: GraphMessage[] = data.value ?? [];

    // Deduplicate by conversationId — keep first occurrence (most recent message per conversation)
    const seen = new Set<string>();
    const threads: ThreadSummary[] = [];

    for (const msg of messages) {
      if (!msg.conversationId || seen.has(msg.conversationId) || msg.isDraft) continue;
      seen.add(msg.conversationId);
      threads.push({ providerThreadId: msg.conversationId });
      if (threads.length >= top) break;
    }

    return threads;
  }

  async getThreadDetail(
    accessToken: string,
    conversationId: string
  ): Promise<ProviderThreadDetail | null> {
    const params = new URLSearchParams({
      $select: MESSAGE_SELECT,
      $filter: `conversationId eq '${conversationId}'`,
      $orderby: "receivedDateTime asc",
      $top: "20",
    });

    const res = await fetch(`${GRAPH_BASE}/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}`, ConsistencyLevel: "eventual" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const rawMessages: GraphMessage[] = data.value ?? [];

    if (rawMessages.length === 0) return null;

    const messages: ProviderMessage[] = rawMessages
      .filter((m) => !m.isDraft)
      .map((msg) => ({
        providerMessageId: msg.id,
        senderEmail: msg.from?.emailAddress.address.toLowerCase() ?? "",
        senderName: msg.from?.emailAddress.name ?? undefined,
        recipientEmails: msg.toRecipients.map((r) => r.emailAddress.address.toLowerCase()),
        ccEmails: msg.ccRecipients.map((r) => r.emailAddress.address.toLowerCase()),
        subject: msg.subject ?? undefined,
        snippet: msg.bodyPreview ?? undefined,
        sentAt: new Date(msg.receivedDateTime),
        isOutbound: false,
        isUnread: !msg.isRead,
      }));

    if (messages.length === 0) return null;

    const firstMsg = messages[0];
    const lastMsg = messages[messages.length - 1];

    return {
      providerThreadId: conversationId,
      subject: firstMsg.subject,
      snippet: lastMsg.snippet ?? firstMsg.snippet,
      messages,
      lastMessageAt: lastMsg.sentAt,
    };
  }

  async sendMessage(accessToken: string, options: SendMessageOptions): Promise<string> {
    const body: Record<string, unknown> = {
      message: {
        subject: options.subject,
        body: { contentType: "Text", content: options.body },
        toRecipients: options.to
          .split(",")
          .map((addr) => ({ emailAddress: { address: addr.trim() } })),
        ...(options.threadId ? { conversationId: options.threadId } : {}),
      },
      saveToSentItems: true,
    };

    const res = await fetch(`${GRAPH_BASE}/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Outlook sendMessage failed: ${await res.text()}`);

    // Graph sendMail returns 202 with no body — return conversationId as message ID
    return options.threadId ?? `outlook-sent-${Date.now()}`;
  }

  async getMessageBody(accessToken: string, providerMessageId: string): Promise<string | null> {
    const res = await fetch(
      `${GRAPH_BASE}/messages/${providerMessageId}?$select=body`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const content: string = data.body?.content ?? "";

    // Strip HTML if contentType is html
    if (data.body?.contentType === "html") {
      return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }

    return content;
  }
}
