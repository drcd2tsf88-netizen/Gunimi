-- Business Memory Layer: workspace_memories table
-- Chapter 19 (Memory Identity) + Chapter 20 (Versioning) + Chapter 21 (Provenance)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS workspace_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('contact', 'company', 'deal')),

  -- Memory type: 7 types from Blueprint Chapter 4
  memory_type TEXT NOT NULL CHECK (
    memory_type IN ('commitment', 'relationship_pattern', 'preference', 'outcome', 'context', 'team', 'risk')
  ),

  -- Core content (natural language, Trust Boundary enforced at extraction)
  content TEXT NOT NULL,

  -- Lifecycle state: Chapter 3
  state TEXT NOT NULL DEFAULT 'active' CHECK (
    state IN ('active', 'weakened', 'evolved', 'decayed', 'archived')
  ),

  -- Confidence: Chapter 7 (uncertain memories never surfaced)
  confidence TEXT NOT NULL DEFAULT 'stated' CHECK (
    confidence IN ('observed', 'stated', 'inferred', 'uncertain')
  ),

  -- Source: Chapter 5
  source TEXT NOT NULL CHECK (
    source IN ('note', 'signal_archive', 'interaction_pattern', 'ai_extraction', 'user_manual')
  ),

  -- Memory Identity: Chapter 19
  created_by TEXT NOT NULL DEFAULT 'system' CHECK (created_by IN ('system', 'user', 'ai_core')),
  updated_by TEXT NOT NULL DEFAULT 'system' CHECK (updated_by IN ('system', 'user', 'ai_core')),
  signal_ids TEXT[] NOT NULL DEFAULT '{}',
  evidence_ids TEXT[] NOT NULL DEFAULT '{}',
  revision INTEGER NOT NULL DEFAULT 1,
  version TEXT NOT NULL DEFAULT '1.0',

  -- Version history: Chapter 20 (append-only JSONB array of MemoryVersion objects)
  version_history JSONB NOT NULL DEFAULT '[]',

  -- Provenance chain: Chapter 21 (array of ProvenanceEntry objects)
  provenance JSONB NOT NULL DEFAULT '[]',

  -- Expiry for decay scheduling
  expires_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for efficient retrieval patterns
CREATE INDEX IF NOT EXISTS idx_workspace_memories_workspace
  ON workspace_memories(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_memories_entity
  ON workspace_memories(entity_id, entity_type);

CREATE INDEX IF NOT EXISTS idx_workspace_memories_active
  ON workspace_memories(workspace_id, state)
  WHERE state = 'active';

CREATE INDEX IF NOT EXISTS idx_workspace_memories_type
  ON workspace_memories(memory_type);

-- RLS
ALTER TABLE workspace_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_can_read_memories"
  ON workspace_memories FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_can_insert_memories"
  ON workspace_memories FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_can_update_memories"
  ON workspace_memories FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_memberships WHERE user_id = auth.uid()
    )
  );
