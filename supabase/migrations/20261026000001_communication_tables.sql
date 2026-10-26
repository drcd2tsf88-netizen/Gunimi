-- ============================================================
-- Gunimi — Communications (Teams, WhatsApp)
-- ============================================================

CREATE TABLE IF NOT EXISTS communication_threads (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  connection_id        uuid NOT NULL REFERENCES email_connections(id) ON DELETE CASCADE,
  channel              text NOT NULL CHECK (channel IN ('teams', 'whatsapp')),
  provider_thread_id   text NOT NULL,
  chat_type            text CHECK (chat_type IN ('oneOnOne', 'group', 'meeting')),
  display_name         text,
  snippet              text,
  participant_emails   text[] NOT NULL DEFAULT '{}',
  message_count        integer NOT NULL DEFAULT 0,
  last_message_at      timestamptz,
  has_unread           boolean NOT NULL DEFAULT false,
  contact_id           uuid REFERENCES workspace_people(id) ON DELETE SET NULL,
  company_id           uuid REFERENCES workspace_companies(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  synced_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (connection_id, provider_thread_id)
);

CREATE TABLE IF NOT EXISTS communication_messages (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  thread_id            uuid NOT NULL REFERENCES communication_threads(id) ON DELETE CASCADE,
  provider_message_id  text NOT NULL,
  sender_email         text,
  sender_name          text,
  body                 text,
  sent_at              timestamptz NOT NULL,
  is_outbound          boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, provider_message_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comm_threads_workspace
  ON communication_threads (workspace_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_threads_contact
  ON communication_threads (contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comm_threads_company
  ON communication_threads (company_id) WHERE company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comm_messages_thread
  ON communication_messages (thread_id, sent_at DESC);

-- RLS
ALTER TABLE communication_threads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comm_threads_select_member"
  ON communication_threads FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = communication_threads.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "comm_messages_select_member"
  ON communication_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = communication_messages.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );
