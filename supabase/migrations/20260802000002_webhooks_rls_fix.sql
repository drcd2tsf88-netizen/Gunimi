-- Security fix: restrict webhook SELECT to workspace admins and owners only.
--
-- Previously all workspace members could SELECT the full row, including the
-- plaintext signing secret. The application layer no longer queries the secret
-- in getWebhooks(), but defense-in-depth requires the DB to enforce the same
-- boundary. Regular members have no legitimate reason to read webhook records.
--
-- Run in Supabase Dashboard → SQL Editor.

DROP POLICY IF EXISTS "workspace_webhooks_read" ON workspace_webhooks;

CREATE POLICY "workspace_webhooks_read_admin"
  ON workspace_webhooks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
