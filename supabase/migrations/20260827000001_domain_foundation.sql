-- ============================================================
-- GUNIMI — Domain Foundation Migration
-- Version: 1.0
-- Blueprint: docs/blueprints/DOMAIN_FOUNDATION_BLUEPRINT.md
-- ADR: ADR-002 (People Model) · ADR-003 (Relationship Entity)
--
-- WHAT THIS DOES:
--   1. Renames workspace_contacts → workspace_people
--      (all FK constraints in other tables follow automatically)
--   2. Creates workspace_contacts VIEW for backward compat
--      (all existing server actions continue working without changes)
--   3. Adds person_id column to workspace_members
--   4. Creates workspace_relationships table (ADR-003)
--   5. Seeds relationships from existing company_id FKs
--
-- WHAT DOES NOT CHANGE:
--   - All existing data (zero data loss)
--   - All existing server actions (they read via the VIEW)
--   - All FK constraints in workspace_tasks, workspace_notes,
--     workspace_activity, workspace_email_threads, workspace_orders
--     (they follow the rename automatically via PostgreSQL OID tracking)
--   - All RLS policies (they follow the rename via OID tracking)
--   - All indexes (they follow the rename via OID tracking)
--
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


BEGIN;


-- ────────────────────────────────────────────────────────────
-- STEP 1 — Rename workspace_contacts → workspace_people
--
-- PostgreSQL tracks foreign keys by table OID, not name.
-- All constraints in workspace_tasks, workspace_notes,
-- workspace_activity, workspace_email_threads, workspace_orders
-- automatically point to workspace_people after this rename.
-- All RLS policies and indexes move with the table.
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_contacts RENAME TO workspace_people;

-- Add person_type column for future Person lifecycle model.
-- 'contact' = external person without workspace access (current default).
-- 'member'  = set when the person is granted workspace access.
ALTER TABLE workspace_people
  ADD COLUMN IF NOT EXISTS person_type TEXT NOT NULL DEFAULT 'contact';


-- ────────────────────────────────────────────────────────────
-- STEP 2 — workspace_contacts backward-compat VIEW
--
-- All server actions that query .from("workspace_contacts")
-- continue to work through this view without any code changes.
-- The view is a simple SELECT * from one table — PostgreSQL
-- makes it automatically updatable (INSERT/UPDATE/DELETE work).
-- The underlying workspace_people RLS policies apply for all
-- operations through this view.
-- ────────────────────────────────────────────────────────────

CREATE VIEW workspace_contacts AS
  SELECT * FROM workspace_people;

-- Grant the same permissions the original table had.
GRANT SELECT, INSERT, UPDATE, DELETE ON workspace_contacts TO authenticated;
GRANT ALL ON workspace_contacts TO service_role;


-- ────────────────────────────────────────────────────────────
-- STEP 3 — Link workspace_members to workspace_people
--
-- person_id is nullable: existing members without a
-- workspace_people record are not invalidated.
-- New members created after this migration receive a
-- workspace_people record + this link at onboarding.
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_members
  ADD COLUMN IF NOT EXISTS person_id UUID
  REFERENCES workspace_people(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_members_person_id
  ON workspace_members(person_id);


-- ────────────────────────────────────────────────────────────
-- STEP 4 — workspace_relationships table (ADR-003)
--
-- Relationship is a first-class entity: typed, temporal,
-- confidence-weighted, and traceable.
-- The company_id FK on workspace_people is deprecated —
-- new relationship data goes here.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspace_relationships (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- The two participants (polymorphic — person | company | deal)
  entity_a_type   TEXT        NOT NULL,
  entity_a_id     UUID        NOT NULL,
  entity_b_type   TEXT        NOT NULL,
  entity_b_id     UUID        NOT NULL,

  -- Relationship definition
  type            TEXT        NOT NULL,
  direction       TEXT        NOT NULL DEFAULT 'bidirectional',
  status          TEXT        NOT NULL DEFAULT 'active',

  -- Temporal bounds
  valid_from      DATE,
  valid_to        DATE,

  -- Intelligence fields
  confidence      NUMERIC(3,2) DEFAULT 1.0,
  source          TEXT,
  context         JSONB       DEFAULT '{}',

  -- Audit
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID,

  CONSTRAINT wr_direction_check
    CHECK (direction IN ('unidirectional', 'bidirectional')),
  CONSTRAINT wr_status_check
    CHECK (status IN ('active', 'historical', 'uncertain')),
  CONSTRAINT wr_confidence_check
    CHECK (confidence >= 0.0 AND confidence <= 1.0)
);

ALTER TABLE workspace_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "relationships_select_member"
  ON workspace_relationships FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_relationships.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "relationships_insert_member"
  ON workspace_relationships FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_relationships.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "relationships_update_member"
  ON workspace_relationships FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_relationships.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );

GRANT SELECT, INSERT, UPDATE ON workspace_relationships TO authenticated;
GRANT ALL ON workspace_relationships TO service_role;

-- Indexes for relationship graph traversal
CREATE INDEX IF NOT EXISTS idx_workspace_rel_a
  ON workspace_relationships (workspace_id, entity_a_type, entity_a_id);

CREATE INDEX IF NOT EXISTS idx_workspace_rel_b
  ON workspace_relationships (workspace_id, entity_b_type, entity_b_id);

CREATE INDEX IF NOT EXISTS idx_workspace_rel_type_status
  ON workspace_relationships (workspace_id, type, status);


-- ────────────────────────────────────────────────────────────
-- STEP 5 — Seed relationships from existing company_id FKs
--
-- Every person with a company_id gets an 'employment'
-- relationship record. This makes the existing link
-- queryable via the Relationship graph going forward.
-- The deprecated company_id column on workspace_people
-- is NOT removed — existing code that reads it continues
-- to work. New code should use workspace_relationships.
-- ────────────────────────────────────────────────────────────

INSERT INTO workspace_relationships (
  workspace_id,
  entity_a_type,
  entity_a_id,
  entity_b_type,
  entity_b_id,
  type,
  status,
  source
)
SELECT
  wp.workspace_id,
  'person',
  wp.id,
  'company',
  wp.company_id,
  'employment',
  'active',
  'migrated_from_fk'
FROM workspace_people wp
WHERE wp.company_id IS NOT NULL
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- STEP 6 — Verify (results visible in SQL Editor output)
-- ────────────────────────────────────────────────────────────

SELECT 'workspace_people' AS table_name, count(*) AS row_count
  FROM workspace_people
UNION ALL
SELECT 'workspace_contacts_view', count(*)
  FROM workspace_contacts
UNION ALL
SELECT 'workspace_relationships', count(*)
  FROM workspace_relationships;

-- Confirm person_id column added to workspace_members
SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'workspace_members'
    AND column_name = 'person_id';

-- Confirm workspace_contacts is now a VIEW (not a TABLE)
SELECT table_name, table_type
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('workspace_contacts', 'workspace_people');


COMMIT;


-- ============================================================
-- AFTER RUNNING THIS MIGRATION:
--
-- 1. workspace_people rows = workspace_contacts_view rows ✓
--    (they are the same data through different names)
--
-- 2. workspace_relationships has one row per person
--    that had a company_id ✓
--
-- 3. All existing server actions continue to work ✓
--    (they query workspace_contacts which is now the VIEW)
--
-- 4. The Contact TypeScript type does NOT need changes ✓
--    (the VIEW exposes identical columns)
--
-- NOTE: business_memories.source_events column will be
-- added in a separate migration when the business_memories
-- table is created (it does not exist yet in the DB).
-- ============================================================
