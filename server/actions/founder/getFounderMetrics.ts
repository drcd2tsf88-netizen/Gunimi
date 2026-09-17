"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type DailyCount = { date: string; count: number };

export type RecentSignup = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  workspaceCount: number;
  role: string | null;
};

export type WorkspaceActivity = {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  lastAIActivity: string | null;
  signalCount: number;
  isSuspended: boolean;
  aiSuspended: boolean;
};

export type AIBudgetAlert = {
  workspaceId: string;
  workspaceName: string;
  todayTokens: number;
  dailyLimit: number;
  pct: number;
};

export type FounderMetrics = {
  platform: {
    workspaceCount: number;
    userCount: number;
    activeUsersToday: number;
    aiRequestsToday: number;
    aiTokensToday: number;
    aiCostToday: number;
    aiCostAllTime: number;
    activeSignals: number;
    criticalSignals: number;
    lastSignalAt: string | null;
    pendingInvites: number;
  };
  growth: {
    workspacesByDay: DailyCount[];
    usersByDay: DailyCount[];
  };
  recentSignups: RecentSignup[];
  workspaceActivity: WorkspaceActivity[];
  aiBudgetAlerts: AIBudgetAlert[];
  generatedAt: string;
};

const EMPTY: FounderMetrics = {
  platform: {
    workspaceCount: 0,
    userCount: 0,
    activeUsersToday: 0,
    aiRequestsToday: 0,
    aiTokensToday: 0,
    aiCostToday: 0,
    aiCostAllTime: 0,
    activeSignals: 0,
    criticalSignals: 0,
    lastSignalAt: null,
    pendingInvites: 0,
  },
  growth: { workspacesByDay: [], usersByDay: [] },
  recentSignups: [],
  workspaceActivity: [],
  aiBudgetAlerts: [],
  generatedAt: new Date().toISOString(),
};

function buildDailyCounts(rows: Array<{ created_at: string }>, days: number): DailyCount[] {
  const counts = new Map<string, number>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    counts.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of rows) {
    const date = (row.created_at as string).slice(0, 10);
    if (counts.has(date)) counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export async function getFounderMetrics(): Promise<FounderMetrics> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysIso = thirtyDaysAgo.toISOString();

    const [
      wsResult,
      profilesResult,
      signalsResult,
      aiTodayResult,
      aiAllTimeResult,
      invitesResult,
      wsRecentResult,
      usersRecentResult,
      wsActivityResult,
    ] = await Promise.all([
      supabaseAdmin.from("workspaces").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("workspace_signals")
        .select("state, severity, produced_at")
        .order("produced_at", { ascending: false })
        .limit(2000),
      supabaseAdmin
        .from("ai_usage_logs")
        .select("user_id, workspace_id, input_tokens, output_tokens, estimated_cost_usd")
        .gte("created_at", todayIso),
      supabaseAdmin
        .from("ai_usage_logs")
        .select("estimated_cost_usd"),
      supabaseAdmin.from("workspace_invites").select("status"),
      supabaseAdmin
        .from("workspaces")
        .select("created_at")
        .gte("created_at", thirtyDaysIso),
      supabaseAdmin
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysIso),
      supabaseAdmin
        .from("workspaces")
        .select("id, name, created_at, is_suspended, ai_suspended, ai_daily_token_limit")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    // Platform counts
    const workspaceCount = wsResult.count ?? 0;
    const userCount = profilesResult.count ?? 0;

    // Signals
    const signals = signalsResult.data ?? [];
    const activeSignals = signals.filter((s) => s.state === "active");
    const criticalSignals = activeSignals.filter((s) => s.severity === "critical");
    const lastSignalAt = signals.length > 0 ? (signals[0].produced_at as string) : null;

    // AI today
    const aiToday = aiTodayResult.data ?? [];
    const activeUserIdsToday = new Set(aiToday.map((r) => r.user_id).filter(Boolean));
    const aiRequestsToday = aiToday.length;
    let aiTokensToday = 0;
    let aiCostToday = 0;
    for (const r of aiToday) {
      aiTokensToday += (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
      aiCostToday += Number(r.estimated_cost_usd ?? 0);
    }

    // AI all-time cost
    let aiCostAllTime = 0;
    for (const r of aiAllTimeResult.data ?? []) {
      aiCostAllTime += Number(r.estimated_cost_usd ?? 0);
    }

    // Invites
    const pendingInvites = (invitesResult.data ?? []).filter((i) => i.status === "pending").length;

    // Growth data (30 days)
    const workspacesByDay = buildDailyCounts(
      (wsRecentResult.data ?? []) as Array<{ created_at: string }>,
      30
    );
    const usersByDay = buildDailyCounts(
      (usersRecentResult.data ?? []) as Array<{ created_at: string }>,
      30
    );

    // Recent signups (last 15 users)
    const { data: recentProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, platform_role, created_at")
      .order("created_at", { ascending: false })
      .limit(15);

    const recentProfileIds = (recentProfiles ?? []).map((p) => p.id as string);
    const { data: memberRows } = recentProfileIds.length
      ? await supabaseAdmin
          .from("workspace_members")
          .select("user_id")
          .in("user_id", recentProfileIds)
      : { data: [] };

    const wsCountMap = new Map<string, number>();
    for (const row of memberRows ?? []) {
      const key = row.user_id as string;
      wsCountMap.set(key, (wsCountMap.get(key) ?? 0) + 1);
    }

    const recentSignups: RecentSignup[] = (recentProfiles ?? []).map((p) => ({
      id: p.id as string,
      email: (p.email as string) ?? "",
      fullName: (p.full_name as string | null) ?? null,
      createdAt: p.created_at as string,
      workspaceCount: wsCountMap.get(p.id as string) ?? 0,
      role: (p.platform_role as string | null) ?? null,
    }));

    // Workspace activity
    const wsActivity = wsActivityResult.data ?? [];
    const wsIds = wsActivity.map((w) => w.id as string);

    const [memberCountResult, signalCountResult, aiLastResult] = await Promise.all([
      wsIds.length
        ? supabaseAdmin.from("workspace_members").select("workspace_id").in("workspace_id", wsIds)
        : Promise.resolve({ data: [] }),
      wsIds.length
        ? supabaseAdmin
            .from("workspace_signals")
            .select("workspace_id")
            .in("workspace_id", wsIds)
            .eq("state", "active")
        : Promise.resolve({ data: [] }),
      wsIds.length
        ? supabaseAdmin
            .from("ai_usage_logs")
            .select("workspace_id, created_at")
            .in("workspace_id", wsIds)
            .order("created_at", { ascending: false })
            .limit(wsIds.length * 5)
        : Promise.resolve({ data: [] }),
    ]);

    const memberMap = new Map<string, number>();
    for (const r of memberCountResult.data ?? []) {
      const k = r.workspace_id as string;
      memberMap.set(k, (memberMap.get(k) ?? 0) + 1);
    }

    const signalMap = new Map<string, number>();
    for (const r of signalCountResult.data ?? []) {
      const k = r.workspace_id as string;
      signalMap.set(k, (signalMap.get(k) ?? 0) + 1);
    }

    const lastAIMap = new Map<string, string>();
    for (const r of aiLastResult.data ?? []) {
      const k = r.workspace_id as string;
      if (!lastAIMap.has(k)) lastAIMap.set(k, r.created_at as string);
    }

    const workspaceActivity: WorkspaceActivity[] = wsActivity.map((w) => ({
      id: w.id as string,
      name: (w.name as string) ?? "Unnamed",
      memberCount: memberMap.get(w.id as string) ?? 0,
      createdAt: w.created_at as string,
      lastAIActivity: lastAIMap.get(w.id as string) ?? null,
      signalCount: signalMap.get(w.id as string) ?? 0,
      isSuspended: (w.is_suspended as boolean) === true,
      aiSuspended: (w.ai_suspended as boolean) === true,
    }));

    // AI budget alerts (workspaces at >60% of daily limit)
    const todayTokensByWs = new Map<string, number>();
    for (const r of aiToday) {
      const k = (r.workspace_id as string) ?? "__none__";
      todayTokensByWs.set(k, (todayTokensByWs.get(k) ?? 0) + ((r.input_tokens ?? 0) + (r.output_tokens ?? 0)));
    }

    const aiBudgetAlerts: AIBudgetAlert[] = [];
    for (const w of wsActivity) {
      const todayTokens = todayTokensByWs.get(w.id as string) ?? 0;
      const dailyLimit = (w.ai_daily_token_limit as number) ?? 100_000;
      const pct = dailyLimit > 0 ? Math.round((todayTokens / dailyLimit) * 100) : 0;
      if (pct >= 60) {
        aiBudgetAlerts.push({
          workspaceId: w.id as string,
          workspaceName: (w.name as string) ?? "Unnamed",
          todayTokens,
          dailyLimit,
          pct,
        });
      }
    }
    aiBudgetAlerts.sort((a, b) => b.pct - a.pct);

    return {
      platform: {
        workspaceCount,
        userCount,
        activeUsersToday: activeUserIdsToday.size,
        aiRequestsToday,
        aiTokensToday,
        aiCostToday,
        aiCostAllTime,
        activeSignals: activeSignals.length,
        criticalSignals: criticalSignals.length,
        lastSignalAt,
        pendingInvites,
      },
      growth: { workspacesByDay, usersByDay },
      recentSignups,
      workspaceActivity,
      aiBudgetAlerts,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error("[getFounderMetrics] failed:", err);
    return { ...EMPTY, generatedAt: new Date().toISOString() };
  }
}
