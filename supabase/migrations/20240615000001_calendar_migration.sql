-- ============================================================
-- ORBIT AI OS — Calendar Integration Migration
-- Run after supabase-rls-setup.sql has been applied.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — calendar_connections
-- One row per (workspace, user, provider). Unique constraint
-- ensures re-connecting replaces the existing token set.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS calendar_connections (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider               text NOT NULL CHECK (provider IN ('google', 'microsoft')),
  provider_account_email text,
  access_token           text NOT NULL,
  refresh_token          text,
  token_expires_at       timestamptz,
  scope                  text,
  connected_at           timestamptz NOT NULL DEFAULT now(),
  last_synced_at         timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id, provider)
);


-- ────────────────────────────────────────────────────────────
-- STEP 2 — calendar_events
-- Synced events from the connected provider. Cascades on
-- connection delete so removing a calendar clears its events.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS calendar_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  connection_id     uuid NOT NULL REFERENCES calendar_connections(id) ON DELETE CASCADE,
  provider_event_id text NOT NULL,
  title             text NOT NULL,
  description       text,
  start_at          timestamptz NOT NULL,
  end_at            timestamptz NOT NULL,
  organizer_email   text,
  organizer_name    text,
  location          text,
  html_link         text,
  status            text NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('confirmed', 'tentative', 'cancelled')),
  all_day           boolean NOT NULL DEFAULT false,
  synced_at         timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (connection_id, provider_event_id)
);


-- ────────────────────────────────────────────────────────────
-- STEP 3 — Indexes
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_calendar_connections_workspace
  ON calendar_connections (workspace_id);

CREATE INDEX IF NOT EXISTS idx_calendar_connections_user
  ON calendar_connections (workspace_id, user_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_workspace_start
  ON calendar_events (workspace_id, start_at);

CREATE INDEX IF NOT EXISTS idx_calendar_events_connection
  ON calendar_events (connection_id);


-- ────────────────────────────────────────────────────────────
-- STEP 4 — Enable RLS
-- ────────────────────────────────────────────────────────────

ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events      ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- STEP 5 — RLS Policies: calendar_connections
-- Only the owning user within the workspace can see/manage
-- their own connection. Other workspace members see nothing here.
-- ────────────────────────────────────────────────────────────

CREATE POLICY "calendar_connections_select_own"
  ON calendar_connections FOR SELECT TO authenticated
  USING (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = calendar_connections.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "calendar_connections_insert_own"
  ON calendar_connections FOR INSERT TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = calendar_connections.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "calendar_connections_delete_own"
  ON calendar_connections FOR DELETE TO authenticated
  USING (
    user_id::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = calendar_connections.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 6 — RLS Policies: calendar_events
-- All workspace members can read events (shared scheduling context).
-- Only the service role (supabaseAdmin) writes events via sync.
-- ────────────────────────────────────────────────────────────

CREATE POLICY "calendar_events_select_member"
  ON calendar_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = calendar_events.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ============================================================
-- DONE — add to supabase-rls-setup.sql STEP numbering
-- after deployment. Remember to add GOOGLE_CLIENT_ID and
-- GOOGLE_CLIENT_SECRET to environment variables.
-- ============================================================
