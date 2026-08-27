import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type PlatformHealth = {
  workspaceCount: number;
  userCount: number;
  signals: {
    total: number;
    active: number;
    critical: number;
    lastProducedAt: string | null;
  };
  ai: {
    requestsToday: number;
    tokensToday: number;
    costToday: number;
  };
  invites: {
    pending: number;
    accepted: number;
  };
  generatedAt: string;
};

export async function getPlatformHealth(): Promise<PlatformHealth> {
  const blank: PlatformHealth = {
    workspaceCount: 0,
    userCount: 0,
    signals: { total: 0, active: 0, critical: 0, lastProducedAt: null },
    ai: { requestsToday: 0, tokensToday: 0, costToday: 0 },
    invites: { pending: 0, accepted: 0 },
    generatedAt: new Date().toISOString(),
  };

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const [
      wsResult,
      usersResult,
      signalsResult,
      aiLogsResult,
      invitesResult,
    ] = await Promise.all([
      supabaseAdmin.from("workspaces").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("workspace_signals")
        .select("state, severity, produced_at")
        .order("produced_at", { ascending: false })
        .limit(5000),
      supabaseAdmin
        .from("ai_usage_logs")
        .select("input_tokens, output_tokens, estimated_cost_usd")
        .gte("created_at", todayIso),
      supabaseAdmin
        .from("workspace_invites")
        .select("status"),
    ]);

    // Workspace + user counts
    const workspaceCount = wsResult.count ?? 0;
    const userCount = usersResult.count ?? 0;

    // Signals
    const signals = signalsResult.data ?? [];
    const activeSignals = signals.filter((s) => s.state === "active");
    const criticalSignals = activeSignals.filter((s) => s.severity === "critical");
    const lastProducedAt = signals.length > 0 ? (signals[0].produced_at as string) : null;

    // AI today
    let requestsToday = 0;
    let tokensToday = 0;
    let costToday = 0;
    for (const log of aiLogsResult.data ?? []) {
      requestsToday++;
      tokensToday += (log.input_tokens ?? 0) + (log.output_tokens ?? 0);
      costToday += Number(log.estimated_cost_usd ?? 0);
    }

    // Invites
    let pendingInvites = 0;
    let acceptedInvites = 0;
    for (const inv of invitesResult.data ?? []) {
      if (inv.status === "pending") pendingInvites++;
      if (inv.status === "accepted") acceptedInvites++;
    }

    return {
      workspaceCount,
      userCount,
      signals: {
        total: signals.length,
        active: activeSignals.length,
        critical: criticalSignals.length,
        lastProducedAt,
      },
      ai: { requestsToday, tokensToday, costToday },
      invites: { pending: pendingInvites, accepted: acceptedInvites },
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error("[getPlatformHealth] failed:", err);
    return blank;
  }
}
