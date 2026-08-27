import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export type BudgetCheckResult = {
  allowed: boolean;
  tokensUsedToday: number;
  dailyLimit: number;
  percentUsed: number;
  reason?: "over_daily_limit" | "workspace_suspended";
};

export async function checkAIBudget(workspaceId: string): Promise<BudgetCheckResult> {
  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("ai_suspended, ai_daily_token_limit")
    .eq("id", workspaceId)
    .maybeSingle();

  const isSuspended = workspace?.ai_suspended === true;
  const dailyLimit: number = workspace?.ai_daily_token_limit ?? 100_000;

  if (isSuspended) {
    return {
      allowed: false,
      tokensUsedToday: 0,
      dailyLimit,
      percentUsed: 100,
      reason: "workspace_suspended",
    };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

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
  };
}
