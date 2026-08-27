import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type WorkspaceListItem = {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
  isSuspended: boolean;
  aiSuspended: boolean;
  aiDailyTokenLimit: number;
  featureFlags: Record<string, boolean>;
};

export async function getWorkspacesList(): Promise<WorkspaceListItem[]> {
  try {
    const { data: workspaces, error } = await supabaseAdmin
      .from("workspaces")
      .select("id, name, created_at, is_suspended, ai_suspended, ai_daily_token_limit, feature_flags")
      .order("created_at", { ascending: false });

    if (error || !workspaces) return [];

    const wsIds = workspaces.map((w) => w.id as string);

    const { data: memberRows } = wsIds.length
      ? await supabaseAdmin
          .from("workspace_members")
          .select("workspace_id")
          .in("workspace_id", wsIds)
      : { data: [] };

    const memberCountMap = new Map<string, number>();
    for (const row of memberRows ?? []) {
      const key = row.workspace_id as string;
      memberCountMap.set(key, (memberCountMap.get(key) ?? 0) + 1);
    }

    return workspaces.map((w) => ({
      id: w.id as string,
      name: (w.name as string) ?? "Unnamed",
      createdAt: w.created_at as string,
      memberCount: memberCountMap.get(w.id as string) ?? 0,
      isSuspended: (w.is_suspended as boolean) === true,
      aiSuspended: (w.ai_suspended as boolean) === true,
      aiDailyTokenLimit: (w.ai_daily_token_limit as number) ?? 100_000,
      featureFlags: (w.feature_flags as Record<string, boolean>) ?? {},
    }));
  } catch (err) {
    logger.error("[getWorkspacesList] failed:", err);
    return [];
  }
}
