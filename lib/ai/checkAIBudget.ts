import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getTierFromPreferences, TIER_LIMITS, WorkspaceTier } from "./tiers";

const PLATFORM_DAILY_USD_CAP = Number(process.env.PLATFORM_AI_DAILY_USD_LIMIT ?? "50");

let _platformCostCache = 0;
let _platformCacheAt = 0;
const PLATFORM_CACHE_TTL_MS = 60_000;

export type BudgetCheckResult = {
  allowed: boolean;
  tokensUsedToday: number;
  dailyLimit: number;
  percentUsed: number;
  reason?: "over_daily_limit" | "workspace_suspended" | "platform_cap";
  tier?: WorkspaceTier;
};

export async function checkAIBudget(workspaceId: string): Promise<BudgetCheckResult> {
  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("ai_suspended, ai_daily_token_limit, preferences")
    .eq("id", workspaceId)
    .maybeSingle();

  const isSuspended = workspace?.ai_suspended === true;

  const tier = getTierFromPreferences(workspace?.preferences as Record<string, unknown> | null);
  const tierDefaultTokens = TIER_LIMITS[tier].dailyTokens;
  const dailyLimit: number = workspace?.ai_daily_token_limit ?? tierDefaultTokens;

  if (isSuspended) {
    return { allowed: false, tokensUsedToday: 0, dailyLimit, percentUsed: 100, reason: "workspace_suspended", tier };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Platform-level hard cap — cached 60s to avoid a full table scan on every AI call
  let platformCostToday = _platformCostCache;
  if (Date.now() - _platformCacheAt > PLATFORM_CACHE_TTL_MS) {
    const { data: platformLogs } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("estimated_cost_usd")
      .gte("created_at", todayStart.toISOString());
    platformCostToday = (platformLogs ?? []).reduce(
      (s, l) => s + (Number(l.estimated_cost_usd) || 0),
      0,
    );
    _platformCostCache = platformCostToday;
    _platformCacheAt = Date.now();
  }

  if (platformCostToday >= PLATFORM_DAILY_USD_CAP) {
    return { allowed: false, tokensUsedToday: 0, dailyLimit, percentUsed: 100, reason: "platform_cap", tier };
  }

  const { data: logs } = await supabaseAdmin
    .from("ai_usage_logs")
    .select("input_tokens, output_tokens")
    .eq("workspace_id", workspaceId)
    .gte("created_at", todayStart.toISOString());

  let tokensUsedToday = 0;
  for (const log of logs ?? []) {
    tokensUsedToday += (log.input_tokens ?? 0) + (log.output_tokens ?? 0);
  }

  const percentUsed = dailyLimit > 0 ? (tokensUsedToday / dailyLimit) * 100 : 0;
  const allowed = tokensUsedToday < dailyLimit;

  return {
    allowed,
    tokensUsedToday,
    dailyLimit,
    percentUsed,
    reason: allowed ? undefined : "over_daily_limit",
    tier,
  };
}
