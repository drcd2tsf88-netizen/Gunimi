export type WorkspaceTier = "free" | "starter" | "pro" | "business";

export type TierLimits = {
  dailyTokens: number;
  maxEmailWakeupContacts: number;
  maxPromiseEmailsPerRun: number;
};

export const TIER_LIMITS: Record<WorkspaceTier, TierLimits> = {
  free:     { dailyTokens: 50_000,    maxEmailWakeupContacts: 3,   maxPromiseEmailsPerRun: 5   },
  starter:  { dailyTokens: 150_000,   maxEmailWakeupContacts: 8,   maxPromiseEmailsPerRun: 15  },
  pro:      { dailyTokens: 500_000,   maxEmailWakeupContacts: 25,  maxPromiseEmailsPerRun: 30  },
  business: { dailyTokens: 2_000_000, maxEmailWakeupContacts: 100, maxPromiseEmailsPerRun: 100 },
};

export function getTierFromPreferences(
  preferences: Record<string, unknown> | null | undefined,
): WorkspaceTier {
  const tier = preferences?.tier;
  if (tier === "starter" || tier === "pro" || tier === "business") return tier;
  return "free";
}
