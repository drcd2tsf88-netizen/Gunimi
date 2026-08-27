-- ============================================================
-- GUNIMI — Platform Announcements (Broadcast)
-- Version: 1.0
--
-- Admin-authored announcements shown as dismissable banners
-- to all dashboard users.
--
-- RUN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS platform_announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  body        TEXT,
  type        TEXT        NOT NULL DEFAULT 'info',  -- 'info' | 'warning' | 'critical'
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ
);

-- Only service role reads/writes (admin actions use supabaseAdmin)
ALTER TABLE platform_announcements ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS platform_announcements_active_idx
  ON platform_announcements (is_active, created_at DESC);

-- Verify
SELECT column_name, data_type FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'platform_announcements'
  ORDER BY ordinal_position;
