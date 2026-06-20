"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: string;
  joined_at: string;
};

export async function getUserWorkspaceSummaries(): Promise<WorkspaceSummary[]> {
  try {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_members")
      .select(`
        role,
        created_at,
        workspaces (
          id,
          name,
          slug
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getUserWorkspaceSummaries error:", error);
      return [];
    }

    type MemberRow = {
      role: string;
      created_at: string;
      workspaces: { id: string; name: string; slug: string } | null;
    };

    return ((data as unknown as MemberRow[]) || [])
      .map((m) => {
        const ws = m.workspaces;
        if (!ws) return null;
        return {
          id: ws.id,
          name: ws.name,
          slug: ws.slug,
          role: m.role,
          joined_at: m.created_at,
        };
      })
      .filter(Boolean) as WorkspaceSummary[];
  } catch (error) {
    console.error("getUserWorkspaceSummaries failed:", error);
    return [];
  }
}
