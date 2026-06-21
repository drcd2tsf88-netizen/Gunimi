-- ============================================================
-- ORBITDESK MIGRATION — Add preferences column to workspaces
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
