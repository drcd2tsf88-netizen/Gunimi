-- ============================================================
-- Gunimi — Signal Archive Migration
-- Creates the workspace_signals table, indexes, and RLS policy.
--
-- This is the foundational Signal Archive defined in:
--   docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
--
-- Signals are written by server-side producers (supabaseAdmin).
-- Signals are read by workspace members (authenticated, via RLS).
-- The archive is permanent — resolved signals are never deleted.
--
-- Run in Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- STEP 1 — Create workspace_signals table
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspace_signals (
  -- Primary identity
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Signal Contract (Chapter 4 of Signal Engine Blueprint)
  entity_type         text        NOT NULL,
  entity_id           text        NOT NULL,
  type                text        NOT NULL,
  tier                smallint    NOT NULL,
  severity            text        NOT NULL,
  confidence          text        NOT NULL,
  evidence_key        text        NOT NULL,
  evidence_data       jsonb       NOT NULL DEFAULT '{}',
  action_type         text        NOT NULL,
  produced_by         text        NOT NULL,
  produced_at         timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz,
  resolution_condition text       NOT NULL,
  state               text        NOT NULL DEFAULT 'active',
  claimed_by          text,
  suppressed_until    timestamptz,
  resolved_at         timestamptz,

  -- Signal Identity (Chapter 18)
  origin              text        NOT NULL,
  correlation_id      text        NOT NULL,
  parent_signal_id    uuid        REFERENCES workspace_signals(id) ON DELETE SET NULL,

  -- Signal Evolution (Chapter 19) — ordered array of EvolutionEvent
  evolution_history   jsonb       NOT NULL DEFAULT '[]',

  -- Row timestamps
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  -- Integrity constraints
  CONSTRAINT signals_entity_type_valid CHECK (
    entity_type IN ('deal', 'contact', 'company', 'task', 'email')
  ),
  CONSTRAINT signals_tier_valid CHECK (
    tier IN (1, 2, 3, 4)
  ),
  CONSTRAINT signals_severity_valid CHECK (
    severity IN ('critical', 'warning', 'info')
  ),
  CONSTRAINT signals_confidence_valid CHECK (
    confidence IN ('high', 'medium', 'low')
  ),
  CONSTRAINT signals_state_valid CHECK (
    state IN ('active', 'claimed', 'suppressed', 'resolved', 'archived')
  )
);


-- ────────────────────────────────────────────────────────────
-- STEP 2 — Indexes
-- ────────────────────────────────────────────────────────────

-- Primary access pattern: all active signals for a workspace
CREATE INDEX IF NOT EXISTS idx_signals_workspace_state
  ON workspace_signals(workspace_id, state);

-- Entity-scoped access: signals for a specific entity (Workspace resolvers)
CREATE INDEX IF NOT EXISTS idx_signals_workspace_entity
  ON workspace_signals(workspace_id, entity_id, state);

-- Deduplication check: find existing active signal by type + entity
-- Covers the dedup key: type + entity_type + entity_id
CREATE INDEX IF NOT EXISTS idx_signals_dedup
  ON workspace_signals(workspace_id, type, entity_type, entity_id)
  WHERE state IN ('active', 'claimed', 'suppressed');

-- Tier-based access: Today resolver reads by tier
CREATE INDEX IF NOT EXISTS idx_signals_workspace_tier_state
  ON workspace_signals(workspace_id, tier, state);

-- TTL expiration sweep: find signals past their expiry
CREATE INDEX IF NOT EXISTS idx_signals_expires_at
  ON workspace_signals(expires_at)
  WHERE expires_at IS NOT NULL AND resolved_at IS NULL;

-- Correlation ID: group related signals from the same triggering event
CREATE INDEX IF NOT EXISTS idx_signals_correlation_id
  ON workspace_signals(correlation_id);

-- Evolution chain: find signals derived from a parent
CREATE INDEX IF NOT EXISTS idx_signals_parent_signal_id
  ON workspace_signals(parent_signal_id)
  WHERE parent_signal_id IS NOT NULL;

-- Archive access: Memory reads all archived signals for pattern detection
CREATE INDEX IF NOT EXISTS idx_signals_workspace_archived
  ON workspace_signals(workspace_id, entity_id)
  WHERE state = 'archived';


-- ────────────────────────────────────────────────────────────
-- STEP 3 — updated_at trigger
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_signals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER signals_updated_at
  BEFORE UPDATE ON workspace_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_signals_updated_at();


-- ────────────────────────────────────────────────────────────
-- STEP 4 — Enable RLS
-- ────────────────────────────────────────────────────────────

ALTER TABLE workspace_signals ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- STEP 5 — RLS policies
--
-- Writes (INSERT, UPDATE) use supabaseAdmin (service role)
-- and bypass RLS — no INSERT/UPDATE policies needed.
--
-- SELECT policy: workspace members may read their signals.
-- ────────────────────────────────────────────────────────────

CREATE POLICY "signals_select_member"
  ON workspace_signals FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id::text = workspace_signals.workspace_id::text
        AND wm.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- STEP 6 — Verify
-- ────────────────────────────────────────────────────────────

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'workspace_signals'
ORDER BY ordinal_position;
