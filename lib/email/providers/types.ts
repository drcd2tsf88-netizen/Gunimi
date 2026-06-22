export interface EmailProvider {
  readonly name: string;
  readonly displayName: string;
  getAuthUrl(state: string): string;
  exchangeCode(code: string): Promise<TokenSet>;
  refreshAccessToken(refreshToken: string): Promise<TokenSet>;
  getConnectedEmail(accessToken: string): Promise<string>;
  listThreads(accessToken: string, options?: ThreadListOptions): Promise<ThreadSummary[]>;
  getThreadDetail(accessToken: string, threadId: string): Promise<ProviderThreadDetail | null>;
}

export type TokenSet = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope?: string;
};

export type ThreadListOptions = {
  maxResults?: number;
  afterDate?: Date;
};

export type ThreadSummary = {
  providerThreadId: string;
  historyId?: string;
};

export type ProviderMessage = {
  providerMessageId: string;
  senderEmail: string;
  senderName?: string;
  recipientEmails: string[];
  ccEmails: string[];
  subject?: string;
  snippet?: string;
  sentAt: Date;
  isOutbound: boolean;
  isUnread: boolean;
};

export type ProviderThreadDetail = {
  providerThreadId: string;
  subject?: string;
  snippet?: string;
  messages: ProviderMessage[];
  lastMessageAt?: Date;
  historyId?: string;
};
