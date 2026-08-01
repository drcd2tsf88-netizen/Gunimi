"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export type WorkspaceCalendarItem = {
  id: string;
  type: "task" | "deal";
  title: string;
  date: string;
  status: string;
  priority: string | null;
  href: string;
  entityName: string | null;
  isOverdue: boolean;
  isDueToday: boolean;
};

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function getWorkspaceCalendarItems(
  daysAhead = 30
): Promise<WorkspaceCalendarItem[]> {
  try {
    const user = await getUser();
    if (!user) return [];

    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const from = new Date();
    from.setDate(from.getDate() - 7);
    const to = new Date();
    to.setDate(to.getDate() + daysAhead);

    const [tasksResult, dealsResult] = await Promise.all([
      supabase
        .from("workspace_tasks")
        .select("id, title, status, priority, due_date")
        .eq("workspace_id", workspace.id)
        .neq("status", "done")
        .not("due_date", "is", null)
        .gte("due_date", from.toISOString())
        .lte("due_date", to.toISOString())
        .order("due_date", { ascending: true })
        .limit(50),

      supabase
        .from("workspace_deals")
        .select("id, title, stage, value, expected_close_date, contact_id, company_id")
        .eq("workspace_id", workspace.id)
        .neq("stage", "closed_won")
        .neq("stage", "closed_lost")
        .not("expected_close_date", "is", null)
        .gte("expected_close_date", from.toISOString())
        .lte("expected_close_date", to.toISOString())
        .order("expected_close_date", { ascending: true })
        .limit(30),
    ]);

    const today = todayStart();
    const items: WorkspaceCalendarItem[] = [];

    for (const t of tasksResult.data ?? []) {
      const date = new Date(t.due_date!);
      items.push({
        id: t.id,
        type: "task",
        title: t.title,
        date: t.due_date!,
        status: t.status,
        priority: t.priority,
        href: `/dashboard/tasks`,
        entityName: null,
        isOverdue: date < today,
        isDueToday: isSameDay(date, today),
      });
    }

    for (const d of dealsResult.data ?? []) {
      const date = new Date(d.expected_close_date!);
      items.push({
        id: d.id,
        type: "deal",
        title: d.title,
        date: d.expected_close_date!,
        status: d.stage,
        priority: null,
        href: `/dashboard/deals/${d.id}`,
        entityName: null,
        isOverdue: date < today,
        isDueToday: isSameDay(date, today),
      });
    }

    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return items;
  } catch (err) {
    logger.error("getWorkspaceCalendarItems failed:", err);
    return [];
  }
}
