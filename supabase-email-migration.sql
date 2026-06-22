-- ============================================================
-- ORBIT AI OS — Email Integration Migration
-- Run after supabase-rls-setup.sql and supabase-calendar-migration.sql.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — email_connections
-- One row per (workspace, user, provider).
-- history_id stores the Gmail historyId cursor for incremental sync.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_connections (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider               text NOT NULL CHECK (provider IN ('gmail', 'microsoft365')),
  provider_account_email text NOT NULL,
  access_token           text NOT NULL,
  refresh_token          text,
  token_expires_at       timestamptz,
  scope                  text,
  history_id             text,
  connected_at           timestamptz NOT NULL DEFAULT now(),
  last_synced_at         timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id, provider)
);


-- ────────────────────────────────────────────────────────────
-- STEP 2 — email_threads
-- One row per email thread.
-- contact_id / company_id populated by CRM linker post-sync.
-- AI fields (ai_summary, ai_follow_up_suggestion, ai_sentiment)
-- are nullable — prepared for future AI layer, not populated yet.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_threads (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id             uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  connection_id            uuid NOT NULL REFERENCES email_connections(id) ON DELETE CASCADE,
  provider_thread_id       text NOT NULL,
  subject                  text,
  snippet                  text,
  message_count            integer NOT NULL DEFAULT 0,
  participant_emails       text[] NOT NULL DEFAULT '{}',
  last_message_at          timestamptz,
  has_unread               boolean NOT NULL DEFAULT false,
  -- CRM links (set by crm-linker, nullable)
  contact_id               uuid REFERENCES workspace_contacts(id) ON DELETE SET NULL,
  company_id               uuid REFERENCES workspace_companies(id) ON DELETE SET NULL,
  -- AI foundation (reserved, all nullable — not populated yet)
  ai_summary               text,
  ai_follow_up_suggestion  text,
  ai_sentiment             text CHECK (ai_sentiment IN ('positive', 'neutral', 'negative') OR ai_sentiment IS NULL),
  ai_processed_at          timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  synced_at                timestamptz NOT NULL DEFAULT now(),
  UNIQUE (connection_id, provider_thread_id)
);


-- ────────────────────────────────────────────────────────────
-- STEP 3 — email_messages
-- Individual messages within a thread.
-- body_plain is nullable — reserved for AI full-body processing.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_messages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  thread_id           uuid NOT NULL REFERENCES email_threads(id) ON DELETE CASCADE,
  connection_id       uuid NOT NULL REFERENCES email_connections(id) ON DELETE CASCADE,
  provider_message_id text NOT NULL,
  sender_email        text NOT NULL,
  sender_name         text,
  recipient_emails    text[] NOT NULL DEFAULT '{}',
  cc_emails           text[] NOT NULL DEFAULT '{}',
  subject             text,
  snippet             text,
  body_plain          text,
  sent_at             timestamptz NOT NULL,
  is_outbound         boolean NOT NULL DEFAULT false,
  is_unread           boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (connection_id, provider_message_id)
);


-- ────────────────────────────────────────────────────────────
-- STEP 4 — Indexes
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_email_connections_workspace
  ON email_connections (workspace_id);

CREATE INDEX IF NOT EXISTS idx_email_connections_user
  ON email_connections (workspace_id, user_id);

CREATE INDEX IF NOT EXISTS idx_email_threads_workspace_last_msg
  ON email_threads (workspace_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_threads_contact
  ON email_threads (contact_id) WHERE contact_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_threads_company
  ON email_threads (company_id) WHERE company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_messages_thread
  ON email_messages (thread_id, sent_at DESC);


-- ────────────────────────────────────────────────────────────
-- STEP 5 — Enable RLS
-- ────────────────────────────────────────────────────────────

ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages    ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- STEP 6 — RLS: email_connections
-- Only the owning user within their workspace can manage connections.
-- ────────────────────────────────────────────────────────────

CREATE POLICY "email_connections_select_own"
  ON email_connections FOR SELECT TO authenticated
  USING (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = email_connections.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "email_connections_delete_own"
  ON email_connections FOR DELETE TO authenticated
  USING (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = email_connections.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 7 — RLS: email_threads + email_messages
-- All workspace members can read threads and messages.
-- Writes happen exclusively via supabaseAdmin (sync service).
-- ────────────────────────────────────────────────────────────

CREATE POLICY "email_threads_select_member"
  ON email_threads FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = email_threads.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "email_messages_select_member"
  ON email_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = email_messages.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ============================================================
-- DONE — add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to .env
-- Add https://orbitdesk.online/api/email/callback/gmail
-- as an authorized redirect URI in Google Cloud Console.
-- ============================================================
