"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type WorkspaceAIContext = {
  workspaceName: string;
  analytics: {
    companies: number;
    openDeals: number;
    openTasks: number;
    members: number;
  };
  deals: Array<{
    title: string;
    stage: string;
    value: number | null;
    company: string | null;
    daysSinceUpdated: number;
  }>;
  tasks: Array<{
    title: string;
    priority: string;
    dueDate: string | null;
    isOverdue: boolean;
  }>;
  meetings: Array<{
    title: string;
    startAt: string;
  }>;
  emails: Array<{
    subject: string;
    contact: string | null;
    unread: boolean;
  }>;
  activity: Array<{
    description: string;
  }>;
  memory: string[];
};

type DealRow = {
  title: string;
  stage: string;
  value: number | null;
  updated_at: string;
  company: { name: string } | null;
};

type TaskRow = {
  title: string;
  priority: string;
  due_date: string | null;
};

type MeetingRow = {
  title: string;
  start_at: string;
};

type EmailRow = {
  subject: string | null;
  has_unread: boolean | null;
  contact: { name: string } | null;
};

type ActivityRow = {
  description: string;
};

type MemoryRow = {
  content: string;
};

type WorkspaceRow = {
  name: string;
};

export async function getWorkspaceContext(): Promise<WorkspaceAIContext | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();
    const now = new Date().toISOString();
    const sevenDaysAhead = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      workspaceResult,
      dealsResult,
      tasksResult,
      meetingsResult,
      emailsResult,
      activityResult,
      memoryResult,
      companiesResult,
      membersResult,
    ] = await Promise.all([
      supabase
        .from("workspaces")
        .select("name")
        .eq("id", workspace.id)
        .single(),
      supabase
        .from("workspace_deals")
        .select("title, stage, value, updated_at, company:workspace_companies(name)")
        .eq("workspace_id", workspace.id)
        .neq("stage", "won")
        .neq("stage", "lost")
        .order("updated_at", { ascending: true })
        .limit(10),
      supabase
        .from("workspace_tasks")
        .select("title, priority, due_date")
        .eq("workspace_id", workspace.id)
        .neq("status", "done")
        .order("due_date", { ascending: true })
        .limit(15),
      supabaseAdmin
        .from("calendar_events")
        .select("title, start_at")
        .eq("workspace_id", workspace.id)
        .neq("status", "cancelled")
        .gte("start_at", now)
        .lte("start_at", sevenDaysAhead)
        .order("start_at", { ascending: true })
        .limit(5),
      supabaseAdmin
        .from("email_threads")
        .select("subject, has_unread, contact:workspace_contacts(name)")
        .eq("workspace_id", workspace.id)
        .order("last_message_at", { ascending: false })
        .limit(5),
      supabaseAdmin
        .from("workspace_activity")
        .select("description")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("workspace_memory")
        .select("content")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("workspace_companies")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);

    const today = new Date();
    const nowMs = today.getTime();

    const workspaceName =
      (workspaceResult.data as unknown as WorkspaceRow | null)?.name ??
      "Orbit Workspace";

    const deals = ((dealsResult.data ?? []) as unknown as DealRow[]).map((d) => ({
      title: d.title,
      stage: d.stage,
      value: d.value != null ? Number(d.value) : null,
      company: d.company?.name ?? null,
      daysSinceUpdated: Math.floor(
        (nowMs - new Date(d.updated_at).getTime()) / 86400000
      ),
    }));

    const tasks = ((tasksResult.data ?? []) as unknown as TaskRow[]).map((t) => ({
      title: t.title,
      priority: t.priority,
      dueDate: t.due_date,
      isOverdue: t.due_date ? new Date(t.due_date) < today : false,
    }));

    const meetings = ((meetingsResult.data ?? []) as unknown as MeetingRow[]).map(
      (m) => ({ title: m.title, startAt: m.start_at })
    );

    const emails = ((emailsResult.data ?? []) as unknown as EmailRow[]).map((e) => ({
      subject: e.subject ?? "(No subject)",
      contact: e.contact?.name ?? null,
      unread: e.has_unread ?? false,
    }));

    const activity = ((activityResult.data ?? []) as unknown as ActivityRow[]).map(
      (a) => ({ description: a.description })
    );

    const memory = ((memoryResult.data ?? []) as unknown as MemoryRow[])
      .map((m) => m.content)
      .filter(Boolean);

    return {
      workspaceName,
      analytics: {
        companies: companiesResult.count ?? 0,
        openDeals: deals.length,
        openTasks: tasks.length,
        members: membersResult.count ?? 0,
      },
      deals,
      tasks,
      meetings,
      emails,
      activity,
      memory,
    };
  } catch (error) {
    console.error("getWorkspaceContext failed:", error);
    return null;
  }
}
