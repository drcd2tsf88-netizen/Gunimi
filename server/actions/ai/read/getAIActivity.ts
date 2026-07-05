"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AIActivity = {
  id: string;
  type: string;
  title: string | null;
  description: string;
  createdAt: string;
};

type RawActivityRow = {
  id: string;
  type: string;
  title: string | null;
  description: string;
  created_at: string;
};

export async function getAIActivity(limit = 25, since?: string): Promise<AIActivity[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    let query = supabaseAdmin
      .from("workspace_activity")
      .select("id, type, title, description, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return (data as unknown as RawActivityRow[]).map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title ?? null,
      description: a.description,
      createdAt: a.created_at,
    }));
  } catch {
    return [];
  }
}
