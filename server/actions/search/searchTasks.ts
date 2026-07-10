"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
};

export type TaskSearchRows = {
  tasks: TaskRow[];
};

const EMPTY: TaskSearchRows = { tasks: [] };

export async function searchTasks(query: string): Promise<TaskSearchRows> {
  if (!query.trim()) return EMPTY;

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();
    const pattern = `%${query}%`;

    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, description, status, priority")
      .eq("workspace_id", workspace.id)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      logger.error("[searchTasks] query failed:", error);
      return EMPTY;
    }

    return { tasks: (data ?? []) as TaskRow[] };
  } catch (err) {
    logger.error("[searchTasks] unexpected error:", err);
    return EMPTY;
  }
}
