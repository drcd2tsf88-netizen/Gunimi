-- Signal Feedback
-- Adds a feedback column to workspace_signals so users can mark signals as useful or not.
-- This data drives Signal Engine quality measurement.

ALTER TABLE workspace_signals
  ADD COLUMN IF NOT EXISTS feedback TEXT CHECK (feedback IN ('useful', 'not_useful')),
  ADD COLUMN IF NOT EXISTS feedback_at TIMESTAMPTZ;
