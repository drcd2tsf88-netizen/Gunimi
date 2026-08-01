"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";

export type TaskComment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string | null;
  author_avatar: string | null;
};

export type SubTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  assignee_name: string | null;
  is_recurring: boolean;
  recurrence_frequency: string | null;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  parent_task_id: string | null;
  comments: TaskComment[];
  subtasks: SubTask[];
};

export async function getTaskDetail(taskId: string): Promise<TaskDetail | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data: task } = await supabase
      .from("workspace_tasks")
      .select(`
        id, title, description, status, priority, due_date,
        assigned_to, is_recurring, recurrence_frequency,
        created_at, updated_at, contact_id, parent_task_id
      `)
      .eq("id", taskId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!task) return null;

    const [commentsResult, subtasksResult, membersResult] = await Promise.all([
      supabase
        .from("task_comments")
        .select("id, user_id, content, created_at, updated_at")
        .eq("task_id", taskId)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("workspace_tasks")
        .select("id, title, status, priority, assigned_to, due_date, created_at")
        .eq("parent_task_id", taskId)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("workspace_members")
        .select("user_id, profiles(full_name, avatar_url)")
        .eq("workspace_id", workspace.id),
    ]);

    type ProfileJoin = { full_name: string | null; avatar_url: string | null };
    type MemberRow = { user_id: string; profiles: ProfileJoin | ProfileJoin[] | null };

    const memberMap = new Map<string, { name: string | null; avatar: string | null }>();
    for (const m of (membersResult.data ?? []) as MemberRow[]) {
      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      memberMap.set(m.user_id, {
        name: profile?.full_name ?? null,
        avatar: profile?.avatar_url ?? null,
      });
    }

    const comments: TaskComment[] = (commentsResult.data ?? []).map((c) => ({
      id: c.id,
      user_id: c.user_id,
      content: c.content,
      created_at: c.created_at,
      updated_at: c.updated_at,
      author_name: memberMap.get(c.user_id)?.name ?? null,
      author_avatar: memberMap.get(c.user_id)?.avatar ?? null,
    }));

    const subtasks: SubTask[] = (subtasksResult.data ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      priority: s.priority,
      assigned_to: s.assigned_to,
      due_date: s.due_date,
      created_at: s.created_at,
    }));

    const assignee = task.assigned_to ? memberMap.get(task.assigned_to) : null;

    return {
      ...task,
      description: task.description ?? null,
      assignee_name: assignee?.name ?? null,
      comments,
      subtasks,
    };
  } catch {
    return null;
  }
}
