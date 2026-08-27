-- ============================================================
-- GUNIMI — Tag AI Summary Cache
-- Version: 1.0
--
-- Adds ai_summary + ai_summary_at to workspace_tags so that
-- AI-generated tag profiles are persisted and not regenerated
-- on every hover / page load.
--
-- TTL is enforced by application code (24h default).
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

ALTER TABLE workspace_tags
  ADD COLUMN IF NOT EXISTS ai_summary     TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary_at  TIMESTAMPTZ;

-- Verify
SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'workspace_tags'
    AND column_name IN ('ai_summary', 'ai_summary_at')
  ORDER BY column_name;
