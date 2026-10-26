export type CommunicationChannel = "teams" | "whatsapp";
export type TeamsChatType = "oneOnOne" | "group" | "meeting";

export type CommunicationThread = {
  id: string;
  workspace_id: string;
  connection_id: string;
  channel: CommunicationChannel;
  provider_thread_id: string;
  chat_type: TeamsChatType | null;
  display_name: string | null;
  snippet: string | null;
  participant_emails: string[];
  message_count: number;
  last_message_at: string | null;
  has_unread: boolean;
  contact: { id: string; name: string; email: string | null } | null;
  company: { id: string; name: string } | null;
};

export type CommunicationMessage = {
  id: string;
  provider_message_id: string;
  sender_email: string | null;
  sender_name: string | null;
  body: string | null;
  sent_at: string;
  is_outbound: boolean;
};
