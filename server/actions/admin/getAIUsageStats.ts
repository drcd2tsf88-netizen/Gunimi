import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type AIUsageOverview = {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  avgCostPerRequest: number;
  avgTokensPerRequest: number;
};

export type WorkspaceUsageStat = {
  workspaceId: string;
  workspaceName: string;
  requests: number;
  totalTokens: number;
  costUsd: number;
  lastActivity: string | null;
};

export type UserUsageStat = {
  userId: string;
  userName: string;
  userEmail: string;
  workspaceName: string;
  requests: number;
  totalTokens: number;
  costUsd: number;
  lastRequest: string | null;
};

export type FeatureUsageStat = {
  feature: string;
  requests: number;
  totalTokens: number;
  costUsd: number;
};

export type CostProjection = {
  todayCostUsd: number;
  sevenDayActualUsd: number;
  thirtyDayProjectionUsd: number;
  monthToDateUsd: number;
};

export type TierLimit = {
  name: string;
  requestsPerDay: number;
  tokensPerMonth: number;
};

export const TIER_LIMITS: TierLimit[] = [
  { name: "free",     requestsPerDay: 10,    tokensPerMonth: 50_000 },
  { name: "standard", requestsPerDay: 50,    tokensPerMonth: 500_000 },
  { name: "pro",      requestsPerDay: 200,   tokensPerMonth: 2_000_000 },
  { name: "business", requestsPerDay: 1_000, tokensPerMonth: 10_000_000 },
];

export type AIUsageStats = {
  overview: AIUsageOverview;
  workspaces: WorkspaceUsageStat[];
  users: UserUsageStat[];
  features: FeatureUsageStat[];
  projection: CostProjection;
  tierLimits: TierLimit[];
  generatedAt: string;
};

type RawLog = {
  workspace_id: string | null;
  user_id: string | null;
  feature: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  created_at: string;
};

const EMPTY: AIUsageStats = {
  overview: {
    totalRequests: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCostUsd: 0,
    avgCostPerRequest: 0,
    avgTokensPerRequest: 0,
  },
  workspaces: [],
  users: [],
  features: [],
  projection: {
    todayCostUsd: 0,
    sevenDayActualUsd: 0,
    thirtyDayProjectionUsd: 0,
    monthToDateUsd: 0,
  },
  tierLimits: TIER_LIMITS,
  generatedAt: new Date().toISOString(),
};

export async function getAIUsageStats(): Promise<AIUsageStats> {
  try {
    const { data: rawLogs, error } = await supabaseAdmin
      .from("ai_usage_logs")
      .select(
        "workspace_id, user_id, feature, input_tokens, output_tokens, estimated_cost_usd, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100_000);

    if (error || !rawLogs) return EMPTY;

    const logs = rawLogs as RawLog[];
    if (logs.length === 0) return { ...EMPTY, generatedAt: new Date().toISOString() };

    // Fetch workspace names
    const wsIds = [...new Set(logs.map((l) => l.workspace_id).filter((id): id is string => !!id))];
    const { data: workspaceRows } = wsIds.length
      ? await supabaseAdmin.from("workspaces").select("id, name").in("id", wsIds)
      : { data: [] };
    const wsNameMap = new Map((workspaceRows ?? []).map((w: { id: string; name: string }) => [w.id, w.name]));

    // Fetch user profiles
    const userIds = [...new Set(logs.map((l) => l.user_id).filter((id): id is string => !!id))];
    const { data: profileRows } = userIds.length
      ? await supabaseAdmin.from("profiles").select("id, full_name, email").in("id", userIds)
      : { data: [] };
    const profileMap = new Map(
      (profileRows ?? []).map((p: { id: string; full_name: string | null; email: string | null }) => [
        p.id,
        { name: p.full_name ?? p.email ?? "Unknown", email: p.email ?? "" },
      ])
    );

    // — Overview —
    const totalRequests = logs.length;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCostUsd = 0;
    for (const l of logs) {
      totalInputTokens += l.input_tokens ?? 0;
      totalOutputTokens += l.output_tokens ?? 0;
      totalCostUsd += Number(l.estimated_cost_usd ?? 0);
    }
    const overview: AIUsageOverview = {
      totalRequests,
      totalInputTokens,
      totalOutputTokens,
      totalCostUsd,
      avgCostPerRequest: totalRequests > 0 ? totalCostUsd / totalRequests : 0,
      avgTokensPerRequest:
        totalRequests > 0 ? (totalInputTokens + totalOutputTokens) / totalRequests : 0,
    };

    // — Workspace breakdown —
    const wsAgg = new Map<string, WorkspaceUsageStat>();
    for (const l of logs) {
      const key = l.workspace_id ?? "__none__";
      const cur = wsAgg.get(key);
      const tokens = (l.input_tokens ?? 0) + (l.output_tokens ?? 0);
      const cost = Number(l.estimated_cost_usd ?? 0);
      if (cur) {
        cur.requests++;
        cur.totalTokens += tokens;
        cur.costUsd += cost;
        if (!cur.lastActivity || l.created_at > cur.lastActivity) cur.lastActivity = l.created_at;
      } else {
        wsAgg.set(key, {
          workspaceId: key,
          workspaceName: wsNameMap.get(key) ?? "Unknown",
          requests: 1,
          totalTokens: tokens,
          costUsd: cost,
          lastActivity: l.created_at,
        });
      }
    }
    const workspaces = [...wsAgg.values()].sort((a, b) => b.costUsd - a.costUsd);

    // — User breakdown —
    const userAgg = new Map<string, UserUsageStat>();
    for (const l of logs) {
      const uid = l.user_id ?? "__none__";
      const wsId = l.workspace_id ?? "__none__";
      const key = `${uid}::${wsId}`;
      const profile = profileMap.get(uid);
      const tokens = (l.input_tokens ?? 0) + (l.output_tokens ?? 0);
      const cost = Number(l.estimated_cost_usd ?? 0);
      const cur = userAgg.get(key);
      if (cur) {
        cur.requests++;
        cur.totalTokens += tokens;
        cur.costUsd += cost;
        if (!cur.lastRequest || l.created_at > cur.lastRequest) cur.lastRequest = l.created_at;
      } else {
        userAgg.set(key, {
          userId: uid,
          userName: profile?.name ?? "Unknown",
          userEmail: profile?.email ?? "",
          workspaceName: wsNameMap.get(wsId) ?? "Unknown",
          requests: 1,
          totalTokens: tokens,
          costUsd: cost,
          lastRequest: l.created_at,
        });
      }
    }
    const users = [...userAgg.values()].sort((a, b) => b.costUsd - a.costUsd);

    // — Feature breakdown —
    const ftAgg = new Map<string, FeatureUsageStat>();
    for (const l of logs) {
      const feat = l.feature ?? "unknown";
      const tokens = (l.input_tokens ?? 0) + (l.output_tokens ?? 0);
      const cost = Number(l.estimated_cost_usd ?? 0);
      const cur = ftAgg.get(feat);
      if (cur) {
        cur.requests++;
        cur.totalTokens += tokens;
        cur.costUsd += cost;
      } else {
        ftAgg.set(feat, { feature: feat, requests: 1, totalTokens: tokens, costUsd: cost });
      }
    }
    const features = [...ftAgg.values()].sort((a, b) => b.requests - a.requests);

    // — Cost projection —
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayCost = 0;
    let sevenDayCost = 0;
    let monthToDateCost = 0;
    for (const l of logs) {
      const ts = new Date(l.created_at);
      const cost = Number(l.estimated_cost_usd ?? 0);
      if (ts >= todayStart) todayCost += cost;
      if (ts >= sevenDaysAgo) sevenDayCost += cost;
      if (ts >= monthStart) monthToDateCost += cost;
    }
    const avgDailyCost = sevenDayCost / 7;
    const projection: CostProjection = {
      todayCostUsd: todayCost,
      sevenDayActualUsd: sevenDayCost,
      thirtyDayProjectionUsd: avgDailyCost * 30,
      monthToDateUsd: monthToDateCost,
    };

    return {
      overview,
      workspaces,
      users,
      features,
      projection,
      tierLimits: TIER_LIMITS,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error("[getAIUsageStats] failed:", err);
    return EMPTY;
  }
}
