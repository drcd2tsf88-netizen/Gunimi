-- ============================================================
-- ORBIT AI OS — Relationship Foundation Migration
-- Adds contact_id foreign keys to tasks, notes, and activity.
-- All columns are nullable with ON DELETE SET NULL so existing
-- rows and RLS policies are unaffected.
--
-- Run in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — workspace_tasks.contact_id
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_tasks
  ADD COLUMN IF NOT EXISTS contact_id uuid
  REFERENCES workspace_contacts(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_tasks_contact_id
  ON workspace_tasks(contact_id)
  WHERE contact_id IS NOT NULL;


-- ────────────────────────────────────────────────────────────
-- STEP 2 — workspace_notes.contact_id
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_notes
  ADD COLUMN IF NOT EXISTS contact_id uuid
  REFERENCES workspace_contacts(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_notes_contact_id
  ON workspace_notes(contact_id)
  WHERE contact_id IS NOT NULL;


-- ────────────────────────────────────────────────────────────
-- STEP 3 — workspace_activity.contact_id
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_activity
  ADD COLUMN IF NOT EXISTS contact_id uuid
  REFERENCES workspace_contacts(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_activity_contact_id
  ON workspace_activity(contact_id)
  WHERE contact_id IS NOT NULL;


-- ────────────────────────────────────────────────────────────
-- STEP 4 — Verify
-- ────────────────────────────────────────────────────────────

SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'workspace_tasks',
    'workspace_notes',
    'workspace_activity'
  )
  AND column_name = 'contact_id'
ORDER BY table_name;


-- ============================================================
-- RELATIONSHIP DIAGRAM (after migration)
--
-- workspaces
--   └── workspace_contacts (workspace_id)
--         ├── workspace_tasks    (workspace_id, contact_id →)
--         ├── workspace_notes    (workspace_id, contact_id →)
--         └── workspace_activity (workspace_id, contact_id →,
--                                  company_id →, deal_id →)
--
-- workspace_companies (workspace_id)
--   ├── workspace_contacts (company_id →)
--   ├── workspace_deals    (company_id →)
--   ├── workspace_notes    (company_id →)
--   └── workspace_activity (company_id →)
--
-- workspace_deals (workspace_id, company_id →, contact_id →)
--   └── workspace_activity (deal_id →)
--
-- Every leaf table is doubly guarded:
--   1. workspace_id application filter (getCurrentWorkspace)
--   2. RLS policy (workspace_members membership check)
-- ============================================================
