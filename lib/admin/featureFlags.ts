export type FeatureFlagKey =
  | "beta_orders"
  | "ai_brief"
  | "ai_assistant"
  | "advanced_signals"
  | "workspace_teams";

export type FeatureFlagMeta = {
  label: string;
  description: string;
  defaultOn: boolean;
};

export const KNOWN_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagMeta> = {
  beta_orders:       { label: "Orders Module",      description: "Enable the Orders entity (beta)",                    defaultOn: false },
  ai_brief:          { label: "Daily Brief",         description: "AI-generated daily workspace brief",                defaultOn: true  },
  ai_assistant:      { label: "AI Assistant",        description: "Multi-agent Gunimi Assistant with focused context", defaultOn: true  },
  advanced_signals:  { label: "Advanced Signals",    description: "Extended signal types and signal graph",            defaultOn: false },
  workspace_teams:   { label: "Teams",               description: "Workspace team organisation and member grouping",   defaultOn: true  },
};

export const FLAG_KEYS = Object.keys(KNOWN_FEATURE_FLAGS) as FeatureFlagKey[];
