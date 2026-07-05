"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

const MS_PER_DAY = 86_400_000;

export type AITask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  isOverdue: boolean;
  isDueToday: boolean;
  daysUntilDue: number | null;
  daysPastDue: number | null;
  createdAt: string;
};

type RawTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
};

type ProfileRow = { id: string; full_name: string };

export async function getAITasks(): Promise<AITask[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, description, status, priority, due_date, assigned_to, created_at")
      .eq("workspace_id", workspace.id)
      .neq("status", "done")
      .order("due_date", { ascending: true, nullsFirst: false });

    if (error || !data) return [];

    const rawTasks = data as unknown as RawTask[];
    const assigneeIds = [...new Set(rawTasks.filter((t) => t.assigned_to).map((t) => t.assigned_to!))];
    const assigneeMap = new Map<string, string>();

    if (assigneeIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", assigneeIds);
      ((profiles ?? []) as unknown as ProfileRow[]).forEach((p) => {
        assigneeMap.set(p.id, p.full_name);
      });
    }

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return rawTasks.map((t) => {
      const dueDateMs = t.due_date ? new Date(t.due_date).getTime() : null;
      const isOverdue = dueDateMs !== null && dueDateMs < now;
      const isDueToday =
        dueDateMs !== null &&
        dueDateMs >= todayStart.getTime() &&
        dueDateMs <= todayEnd.getTime();
      const diffDays =
        dueDateMs !== null ? Math.ceil((dueDateMs - now) / MS_PER_DAY) : null;

      return {
        id: t.id,
        title: t.title,
        description: t.description ?? null,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date ?? null,
        assigneeId: t.assigned_to ?? null,
        assigneeName: t.assigned_to ? (assigneeMap.get(t.assigned_to) ?? null) : null,
        isOverdue,
        isDueToday,
        daysUntilDue: diffDays !== null && diffDays > 0 ? diffDays : null,
        daysPastDue: isOverdue && diffDays !== null ? Math.abs(diffDays) : null,
        createdAt: t.created_at,
      };
    });
  } catch {
    return [];
  }
}
