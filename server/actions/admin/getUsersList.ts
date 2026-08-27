import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";

export type UserListItem = {
  id: string;
  email: string;
  fullName: string | null;
  platformRole: string | null;
  workspaceCount: number;
  createdAt: string;
};

export async function getUsersList(): Promise<UserListItem[]> {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, platform_role, created_at")
      .order("created_at", { ascending: false });

    if (error || !profiles) return [];

    const userIds = profiles.map((p) => p.id as string);

    const { data: memberRows } = userIds.length
      ? await supabaseAdmin
          .from("workspace_members")
          .select("user_id")
          .in("user_id", userIds)
      : { data: [] };

    const wsCountMap = new Map<string, number>();
    for (const row of memberRows ?? []) {
      const key = row.user_id as string;
      wsCountMap.set(key, (wsCountMap.get(key) ?? 0) + 1);
    }

    return profiles.map((p) => ({
      id: p.id as string,
      email: (p.email as string) ?? "",
      fullName: (p.full_name as string | null) ?? null,
      platformRole: (p.platform_role as string | null) ?? null,
      workspaceCount: wsCountMap.get(p.id as string) ?? 0,
      createdAt: p.created_at as string,
    }));
  } catch (err) {
    logger.error("[getUsersList] failed:", err);
    return [];
  }
}
