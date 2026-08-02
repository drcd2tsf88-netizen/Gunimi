"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";

export type TaskCounts = {
  today: number;
  overdue: number;
};

export async function getTaskCounts(): Promise<TaskCounts> {
  try {
    const user = await getUser();
    if (!user) return { today: 0, overdue: 0 };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { today: 0, overdue: 0 };

    const supabase = await createClient();
    const todayStr = new Date().toISOString().slice(0, 10);

    const { data } = await supabase
      .from("workspace_tasks")
      .select("due_date, status")
      .eq("workspace_id", workspace.id)
      .neq("status", "done");

    if (!data) return { today: 0, overdue: 0 };

    let today = 0;
    let overdue = 0;
    for (const task of data) {
      if (!task.due_date) continue;
      const d = task.due_date.slice(0, 10);
      if (d === todayStr) today++;
      else if (d < todayStr) overdue++;
    }

    return { today, overdue };
  } catch {
    return { today: 0, overdue: 0 };
  }
}
