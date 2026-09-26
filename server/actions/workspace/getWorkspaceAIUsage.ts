"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type WorkspaceAIUsage = {
  tokensUsedToday: number;
  dailyLimit: number;
  percentUsed: number;
  isSuspended: boolean;
};

export async function getWorkspaceAIUsage(): Promise<WorkspaceAIUsage | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data: wsRow } = await supabaseAdmin
      .from("workspaces")
      .select("ai_suspended, ai_daily_token_limit")
      .eq("id", workspace.id)
      .maybeSingle();

    const isSuspended = wsRow?.ai_suspended === true;
    const dailyLimit: number = wsRow?.ai_daily_token_limit ?? 100_000;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: logs } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("input_tokens, output_tokens")
      .eq("workspace_id", workspace.id)
      .gte("created_at", todayStart.toISOString());

    let tokensUsedToday = 0;
    for (const log of logs ?? []) {
      tokensUsedToday += (log.input_tokens ?? 0) + (log.output_tokens ?? 0);
    }

    const percentUsed = dailyLimit > 0 ? Math.min((tokensUsedToday / dailyLimit) * 100, 100) : 0;

    return { tokensUsedToday, dailyLimit, percentUsed, isSuspended };
  } catch {
    return null;
  }
}
