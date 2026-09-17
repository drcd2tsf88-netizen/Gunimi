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
  aiUsed: boolean;
  role: string | null;
};

export type WorkspaceActivity = {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  lastAIActivity: string | null;
  signalCount: number;
  todayTokens: number;
  dailyLimit: number;
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

export type SignalTypeCount = { type: string; count: number };

export type ConversionFunnel = {
  signups: number;
  workspaceActivated: number;
  aiActivated: number;
  retainedD7: number;
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
  funnel: ConversionFunnel;
  growth: {
    workspacesByDay: DailyCount[];
    usersByDay: DailyCount[];
  };
  signalBreakdown: SignalTypeCount[];
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
  funnel: { signups: 0, workspaceActivated: 0, aiActivated: 0, retainedD7: 0 },
  growth: { workspacesByDay: [], usersByDay: [] },
  signalBreakdown: [],
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
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysIso = sevenDaysAgo.toISOString();

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const thirtyDaysIso = thirtyDaysAgo.toISOString();

    // ─── Core platform counts ──────────────────────────────────────────────────
    const [
      wsCountResult,
      userCountResult,
      signalsResult,
      aiTodayResult,
      aiAllTimeResult,
      invitesResult,
      wsGrowthResult,
      userGrowthResult,
      wsActivityResult,
    ] = await Promise.all([
      supabaseAdmin.from("workspaces").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("workspace_signals")
        .select("state, severity, type, produced_at")
        .order("produced_at", { ascending: false })
        .limit(5000),
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
        .limit(100),
    ]);

    // ─── Conversion funnel (parallel) ─────────────────────────────────────────
    const [
      wsMemberUserResult,
      aiAllUserResult,
      aiD7UserResult,
    ] = await Promise.all([
      supabaseAdmin.from("workspace_members").select("user_id"),
      supabaseAdmin.from("ai_usage_logs").select("user_id"),
      supabaseAdmin
        .from("ai_usage_logs")
        .select("user_id")
        .gte("created_at", sevenDaysIso),
    ]);

    const workspaceCount = wsCountResult.count ?? 0;
    const userCount = userCountResult.count ?? 0;

    // ─── Signals ──────────────────────────────────────────────────────────────
    const signals = signalsResult.data ?? [];
    const activeSignals = signals.filter((s) => s.state === "active");
    const criticalSignals = activeSignals.filter((s) => s.severity === "critical");
    const lastSignalAt = signals.length > 0 ? (signals[0].produced_at as string) : null;

    // Signal type breakdown (top 10 active types)
    const typeMap = new Map<string, number>();
    for (const s of activeSignals) {
      const t = (s.type as string) ?? "unknown";
      typeMap.set(t, (typeMap.get(t) ?? 0) + 1);
    }
    const signalBreakdown: SignalTypeCount[] = Array.from(typeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    // ─── AI today ─────────────────────────────────────────────────────────────
    const aiToday = aiTodayResult.data ?? [];
    const activeUserIdsToday = new Set(aiToday.map((r) => r.user_id).filter(Boolean));
    const aiRequestsToday = aiToday.length;
    let aiTokensToday = 0;
    let aiCostToday = 0;
    for (const r of aiToday) {
      aiTokensToday += (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
      aiCostToday += Number(r.estimated_cost_usd ?? 0);
    }

    let aiCostAllTime = 0;
    for (const r of aiAllTimeResult.data ?? []) {
      aiCostAllTime += Number(r.estimated_cost_usd ?? 0);
    }

    const pendingInvites = (invitesResult.data ?? []).filter((i) => i.status === "pending").length;

    // ─── Conversion funnel ────────────────────────────────────────────────────
    const wsActivatedSet = new Set(
      (wsMemberUserResult.data ?? []).map((r) => r.user_id as string).filter(Boolean)
    );
    const aiActivatedSet = new Set(
      (aiAllUserResult.data ?? []).map((r) => r.user_id as string).filter(Boolean)
    );
    const retainedD7Set = new Set(
      (aiD7UserResult.data ?? []).map((r) => r.user_id as string).filter(Boolean)
    );

    const funnel: ConversionFunnel = {
      signups: userCount,
      workspaceActivated: wsActivatedSet.size,
      aiActivated: aiActivatedSet.size,
      retainedD7: retainedD7Set.size,
    };

    // ─── Growth ───────────────────────────────────────────────────────────────
    const workspacesByDay = buildDailyCounts(
      (wsGrowthResult.data ?? []) as Array<{ created_at: string }>,
      30
    );
    const usersByDay = buildDailyCounts(
      (userGrowthResult.data ?? []) as Array<{ created_at: string }>,
      30
    );

    // ─── Today tokens per workspace ───────────────────────────────────────────
    const todayTokensByWs = new Map<string, number>();
    for (const r of aiToday) {
      const k = (r.workspace_id as string) ?? "__none__";
      const tokens = (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
      todayTokensByWs.set(k, (todayTokensByWs.get(k) ?? 0) + tokens);
    }

    // ─── Workspace activity enrichment ────────────────────────────────────────
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
      todayTokens: todayTokensByWs.get(w.id as string) ?? 0,
      dailyLimit: (w.ai_daily_token_limit as number) ?? 100_000,
      isSuspended: (w.is_suspended as boolean) === true,
      aiSuspended: (w.ai_suspended as boolean) === true,
    }));

    // ─── Budget alerts ────────────────────────────────────────────────────────
    const aiBudgetAlerts: AIBudgetAlert[] = workspaceActivity
      .map((w) => ({
        workspaceId: w.id,
        workspaceName: w.name,
        todayTokens: w.todayTokens,
        dailyLimit: w.dailyLimit,
        pct: w.dailyLimit > 0 ? Math.round((w.todayTokens / w.dailyLimit) * 100) : 0,
      }))
      .filter((a) => a.pct >= 60)
      .sort((a, b) => b.pct - a.pct);

    // ─── Recent signups enriched ──────────────────────────────────────────────
    const { data: recentProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, platform_role, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const recentProfileIds = (recentProfiles ?? []).map((p) => p.id as string);
    const { data: recentMemberRows } = recentProfileIds.length
      ? await supabaseAdmin
          .from("workspace_members")
          .select("user_id")
          .in("user_id", recentProfileIds)
      : { data: [] };

    const recentWsCountMap = new Map<string, number>();
    for (const row of recentMemberRows ?? []) {
      const key = row.user_id as string;
      recentWsCountMap.set(key, (recentWsCountMap.get(key) ?? 0) + 1);
    }

    const recentSignups: RecentSignup[] = (recentProfiles ?? []).map((p) => ({
      id: p.id as string,
      email: (p.email as string) ?? "",
      fullName: (p.full_name as string | null) ?? null,
      createdAt: p.created_at as string,
      workspaceCount: recentWsCountMap.get(p.id as string) ?? 0,
      aiUsed: aiActivatedSet.has(p.id as string),
      role: (p.platform_role as string | null) ?? null,
    }));

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
      funnel,
      growth: { workspacesByDay, usersByDay },
      signalBreakdown,
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
