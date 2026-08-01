-- Tasks V2 Migration
-- Adds: subtasks (parent_task_id) + task_comments table

-- ─── Subtasks ─────────────────────────────────────────────────────────────────

ALTER TABLE workspace_tasks
  ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES workspace_tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_tasks_parent_id
  ON workspace_tasks(parent_task_id);

-- ─── Task Comments ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS task_comments (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID        NOT NULL REFERENCES workspaces(id)         ON DELETE CASCADE,
  task_id       UUID        NOT NULL REFERENCES workspace_tasks(id)    ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES auth.users(id)         ON DELETE CASCADE,
  content       TEXT        NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 4000),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id
  ON task_comments(task_id);

CREATE INDEX IF NOT EXISTS idx_task_comments_workspace_id
  ON task_comments(workspace_id);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Workspace members can read all comments in their workspace
CREATE POLICY "task_comments_select" ON task_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = task_comments.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can insert their own comments
CREATE POLICY "task_comments_insert" ON task_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = task_comments.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Users can update only their own comments
CREATE POLICY "task_comments_update" ON task_comments
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Users can delete their own comments; admins/owners can delete any
CREATE POLICY "task_comments_delete" ON task_comments
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = task_comments.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'owner')
    )
  );
