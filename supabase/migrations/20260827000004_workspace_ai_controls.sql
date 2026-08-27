-- ============================================================
-- GUNIMI — Workspace AI Controls
-- Version: 1.0
--
-- Adds per-workspace AI safety controls:
--   ai_suspended        BOOLEAN  — hard kill switch (admin only)
--   ai_daily_token_limit INTEGER — daily cap (default 100K tokens)
--
-- 100K tokens/day ≈ $0.10/day/workspace at gpt-4.1-mini pricing.
-- Platform admin can raise or lower per workspace.
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS ai_suspended          BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ai_daily_token_limit  INTEGER  DEFAULT 100000;

-- Verify
SELECT column_name, data_type, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'workspaces'
    AND column_name IN ('ai_suspended', 'ai_daily_token_limit')
  ORDER BY column_name;
