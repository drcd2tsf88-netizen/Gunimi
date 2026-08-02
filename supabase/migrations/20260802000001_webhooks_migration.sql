-- Webhooks for Gunimi workspace integrations
-- Run manually in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS workspace_webhooks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID       NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  events      TEXT[]      NOT NULL DEFAULT '{}',
  secret      TEXT        NOT NULL,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast workspace lookups
CREATE INDEX IF NOT EXISTS workspace_webhooks_workspace_id_idx
  ON workspace_webhooks(workspace_id);

-- RLS
ALTER TABLE workspace_webhooks ENABLE ROW LEVEL SECURITY;

-- Members can read their workspace webhooks
CREATE POLICY "workspace_webhooks_read"
  ON workspace_webhooks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Only owner/admin can insert
CREATE POLICY "workspace_webhooks_insert"
  ON workspace_webhooks FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Only owner/admin can update
CREATE POLICY "workspace_webhooks_update"
  ON workspace_webhooks FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Only owner/admin can delete
CREATE POLICY "workspace_webhooks_delete"
  ON workspace_webhooks FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
