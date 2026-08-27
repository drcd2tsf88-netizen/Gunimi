-- ============================================================
-- GUNIMI — Admin Console Enhancements
-- Version: 1.0
--
-- 1. Workspace suspension (full platform suspend, not just AI)
-- 2. Feature flags per workspace (JSONB, admin-controlled)
-- 3. Audit log enrichment (actor, action, metadata)
--
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Workspace-level platform controls
ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS is_suspended         BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS feature_flags        JSONB    DEFAULT '{}';

-- 2. Enrich audit_logs with useful fields
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS actor_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS action       TEXT,
  ADD COLUMN IF NOT EXISTS entity_type  TEXT,
  ADD COLUMN IF NOT EXISTS entity_id    TEXT,
  ADD COLUMN IF NOT EXISTS metadata     JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS audit_logs_actor_idx  ON audit_logs (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action, created_at DESC);

-- Verify
SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name IN ('workspaces', 'audit_logs')
    AND column_name IN ('is_suspended', 'feature_flags', 'actor_id', 'action', 'entity_type')
  ORDER BY table_name, column_name;
