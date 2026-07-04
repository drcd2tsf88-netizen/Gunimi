-- ============================================================
-- ORBIT AI OS — workspace_notes workspace isolation migration
-- Run in Supabase SQL Editor after verifying the RLS rewrite
-- in supabase-rls-setup.sql is ready to deploy alongside this.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — Add workspace_id column
-- Nullable: existing rows cannot be backfilled atomically.
-- NOT NULL constraint can be added after verifying zero orphans.
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_notes
  ADD COLUMN IF NOT EXISTS workspace_id uuid
  REFERENCES workspaces(id)
  ON DELETE CASCADE;


-- ────────────────────────────────────────────────────────────
-- STEP 2 — Backfill company-linked notes
-- Derive workspace_id from the linked company's workspace.
-- ────────────────────────────────────────────────────────────

UPDATE workspace_notes wn
SET workspace_id = wc.workspace_id
FROM workspace_companies wc
WHERE wn.company_id = wc.id
  AND wn.workspace_id IS NULL;


-- ────────────────────────────────────────────────────────────
-- STEP 3 — Orphaned note report
-- Notes where company_id IS NULL and workspace_id could not be
-- derived. These were created as standalone notes before workspace
-- isolation was enforced. Do NOT silently assign them.
-- Review manually and reassign to the correct workspace if needed.
-- ────────────────────────────────────────────────────────────

SELECT
  id,
  user_id,
  title,
  created_at
FROM workspace_notes
WHERE company_id IS NULL
  AND workspace_id IS NULL
ORDER BY created_at DESC;


-- ────────────────────────────────────────────────────────────
-- STEP 4 — Coverage summary
-- Verify backfill completeness before enabling NOT NULL.
-- ────────────────────────────────────────────────────────────

SELECT
  COUNT(*) FILTER (WHERE workspace_id IS NOT NULL) AS backfilled,
  COUNT(*) FILTER (WHERE workspace_id IS NULL)     AS orphaned,
  COUNT(*)                                          AS total
FROM workspace_notes;


-- ────────────────────────────────────────────────────────────
-- STEP 5 — (Optional, run after orphan count = 0)
-- Add NOT NULL constraint once all orphans are resolved.
-- ────────────────────────────────────────────────────────────

-- ALTER TABLE workspace_notes
--   ALTER COLUMN workspace_id SET NOT NULL;


-- ============================================================
-- AFTER running this migration:
-- 1. Deploy the updated note policies from supabase-rls-setup.sql STEP 8
-- 2. Confirm application code writes workspace_id on all new note inserts
-- 3. Verify GET /dashboard/notes shows correct workspace-scoped notes
-- ============================================================
