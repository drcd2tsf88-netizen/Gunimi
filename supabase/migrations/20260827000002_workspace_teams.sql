-- ============================================================
-- GUNIMI — Teams & Departments Migration
-- Version: 1.0
--
-- WHAT THIS DOES:
--   1. Creates workspace_teams table
--   2. Adds team_id FK to workspace_members (nullable, one team per member)
--
-- V1 scope: organisational labels only, no RLS data isolation.
-- V2 will add team_id to entities + full RLS isolation policies.
--
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- STEP 1 — workspace_teams
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspace_teams (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  color        TEXT        NOT NULL DEFAULT 'violet',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspace_teams_workspace
  ON workspace_teams(workspace_id);

ALTER TABLE workspace_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_select_member"
  ON workspace_teams FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_teams.workspace_id
        AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "teams_insert_admin"
  ON workspace_teams FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_teams.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "teams_update_admin"
  ON workspace_teams FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_teams.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "teams_delete_admin"
  ON workspace_teams FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_teams.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON workspace_teams TO authenticated;
GRANT ALL ON workspace_teams TO service_role;


-- ────────────────────────────────────────────────────────────
-- STEP 2 — Link workspace_members to workspace_teams
--
-- Nullable: member without a team = no team assigned.
-- ON DELETE SET NULL: deleting a team unassigns members,
-- does not remove them from the workspace.
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_members
  ADD COLUMN IF NOT EXISTS team_id UUID
  REFERENCES workspace_teams(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_members_team_id
  ON workspace_members(team_id);


-- ────────────────────────────────────────────────────────────
-- STEP 3 — Verify
-- ────────────────────────────────────────────────────────────

SELECT 'workspace_teams' AS table_name,
       count(*) AS row_count
  FROM workspace_teams;

SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'workspace_members'
    AND column_name = 'team_id';

COMMIT;
