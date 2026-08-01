-- workspace_attachments: file attachments linked to deals, contacts, or companies
CREATE TABLE IF NOT EXISTS workspace_attachments (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uploaded_by   UUID        NOT NULL REFERENCES auth.users(id),
  entity_type   TEXT        NOT NULL CHECK (entity_type IN ('deal', 'contact', 'company')),
  entity_id     UUID        NOT NULL,
  file_name     TEXT        NOT NULL,
  file_size     INTEGER     NOT NULL,
  mime_type     TEXT        NOT NULL DEFAULT 'application/octet-stream',
  storage_path  TEXT        NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_workspace
  ON workspace_attachments (workspace_id);

CREATE INDEX IF NOT EXISTS idx_attachments_entity
  ON workspace_attachments (entity_type, entity_id);

-- RLS
ALTER TABLE workspace_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view attachments in their workspace"
  ON workspace_attachments FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert attachments in their workspace"
  ON workspace_attachments FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Uploaders and admins can delete attachments"
  ON workspace_attachments FOR DELETE
  USING (
    uploaded_by = auth.uid()
    OR workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- Storage bucket RLS (storage.objects table)
-- Bucket name: workspace-attachments (create in dashboard)
-- Public: false | Max file size: 50 MB
-- ============================================================

-- Allow workspace members to read their own files
CREATE POLICY "Workspace members can read attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'workspace-attachments'
    AND auth.uid() IN (
      SELECT user_id FROM workspace_members wm
      WHERE wm.workspace_id::text = (storage.foldername(name))[1]
    )
  );

-- Allow authenticated users to upload (workspace_id is first path segment)
CREATE POLICY "Workspace members can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'workspace-attachments'
    AND auth.uid() IN (
      SELECT user_id FROM workspace_members wm
      WHERE wm.workspace_id::text = (storage.foldername(name))[1]
    )
  );

-- Allow uploader and admins to delete
CREATE POLICY "Workspace members can delete own attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'workspace-attachments'
    AND auth.uid() IN (
      SELECT user_id FROM workspace_members wm
      WHERE wm.workspace_id::text = (storage.foldername(name))[1]
    )
  );
