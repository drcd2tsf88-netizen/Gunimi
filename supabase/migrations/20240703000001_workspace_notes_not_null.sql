-- ============================================================
-- workspace_notes.workspace_id NOT NULL enforcement
--
-- This migration is safe to apply only when orphan count = 0.
-- It will RAISE an EXCEPTION and abort if any orphaned rows exist,
-- leaving the schema unchanged.
--
-- Prerequisites:
--   1. 20240630000001_notes_workspace_migration.sql must be applied
--   2. All orphaned notes must be reassigned or deleted
--
-- To check orphans before running:
--   SELECT id, user_id, title, created_at
--   FROM workspace_notes WHERE workspace_id IS NULL;
-- ============================================================

DO $$
DECLARE
  orphan_count integer;
BEGIN
  SELECT COUNT(*)
  INTO orphan_count
  FROM workspace_notes
  WHERE workspace_id IS NULL;

  IF orphan_count > 0 THEN
    RAISE EXCEPTION
      'Cannot enforce NOT NULL: % orphaned workspace_notes row(s) found. '
      'Resolve these rows first, then re-run this migration.',
      orphan_count;
  END IF;

  -- Safe to enforce — zero orphans confirmed
  ALTER TABLE workspace_notes
    ALTER COLUMN workspace_id SET NOT NULL;

  RAISE NOTICE 'workspace_notes.workspace_id NOT NULL constraint applied. % rows verified clean.', orphan_count;
END $$;


-- ────────────────────────────────────────────────────────────
-- Add missing performance indexes (safe to run regardless of
-- orphan status — CONCURRENTLY does not block reads or writes)
-- ────────────────────────────────────────────────────────────

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workspace_contacts_email
  ON workspace_contacts (workspace_id, lower(email));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workspace_deals_stage
  ON workspace_deals (workspace_id, stage);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workspace_activity_feed
  ON workspace_activity (workspace_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workspace_notes_workspace_created
  ON workspace_notes (workspace_id, created_at DESC);
