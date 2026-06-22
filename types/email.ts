export type EmailConnection = {
  id: string;
  provider: "gmail" | "microsoft365";
  provider_account_email: string;
  connected_at: string;
  last_synced_at: string | null;
};

export type EmailThread = {
  id: string;
  subject: string | null;
  snippet: string | null;
  message_count: number;
  participant_emails: string[];
  last_message_at: string | null;
  has_unread: boolean;
  contact: { id: string; name: string; email: string | null } | null;
  company: { id: string; name: string } | null;
};
