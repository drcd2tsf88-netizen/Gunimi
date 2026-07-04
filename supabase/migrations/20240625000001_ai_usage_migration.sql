-- AI Usage Logs
-- Tracks every OpenAI API call for cost monitoring and analytics.
-- Access only via service role key (no user-facing RLS policies).

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id                 uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       uuid          REFERENCES workspaces(id)  ON DELETE CASCADE,
  user_id            uuid          REFERENCES profiles(id)    ON DELETE SET NULL,
  feature            text          NOT NULL,
  model              text          NOT NULL DEFAULT 'gpt-4.1-mini',
  provider           text          NOT NULL DEFAULT 'openai',
  input_tokens       integer       NOT NULL DEFAULT 0,
  output_tokens      integer       NOT NULL DEFAULT 0,
  estimated_cost_usd numeric(12,8) NOT NULL DEFAULT 0,
  created_at         timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_usage_logs_workspace_idx  ON ai_usage_logs(workspace_id);
CREATE INDEX IF NOT EXISTS ai_usage_logs_user_idx       ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_usage_logs_created_idx    ON ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS ai_usage_logs_feature_idx    ON ai_usage_logs(feature);

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
-- No user-facing policies — service role access only.
