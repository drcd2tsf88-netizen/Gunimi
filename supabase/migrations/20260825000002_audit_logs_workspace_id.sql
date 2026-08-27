-- Add workspace_id to audit_logs if missing
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS audit_logs_workspace_id_idx ON audit_logs (workspace_id, created_at DESC);
