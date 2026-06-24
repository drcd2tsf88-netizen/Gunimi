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
  companies: Array<{
    id: string;
    name: string;
  }>;
  deals: Array<{
    id: string;
    title: string;
    stage: string;
    value: number | null;
    company: string | null;
    contactId: string | null;
    contactName: string | null;
    expectedCloseDate: string | null;
    daysUntilClose: number | null;
    probability: number | null;
    daysSinceUpdated: number;
    healthScore: number;
    healthLabel: "Healthy" | "Warning" | "At Risk";
  }>;
  contacts: Array<{
    id: string;
    name: string;
    company: string | null;
    status: string | null;
    lastContactedAt: string | null;
    daysSinceContacted: number | null;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    priority: string;
    dueDate: string | null;
    isOverdue: boolean;
    assigneeId: string | null;
    assigneeName: string | null;
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
  derived: {
    stalledDealsCount: number;
    revenueAtRisk: number;
    pastDueRevenue: number;
    upcomingRevenue: number;
    upcomingClosings: Array<{
      id: string;
      title: string;
      value: number | null;
      daysUntilClose: number;
      probability: number | null;
      company: string | null;
    }>;
    pastDueDeals: Array<{
      id: string;
      title: string;
      company: string | null;
      value: number | null;
      daysPastDue: number;
    }>;
    neglectedContacts: Array<{
      id: string;
      name: string;
      company: string | null;
      status: string | null;
      daysSinceContacted: number;
    }>;
    neverContactedContacts: Array<{
      id: string;
      name: string;
      company: string | null;
      ageInDays: number;
    }>;
    weeklyFocus: {
      tasks: Array<{ id: string; title: string; priority: string; dueDate: string }>;
      meetings: Array<{ title: string; startAt: string }>;
      closings: Array<{
        id: string;
        title: string;
        value: number | null;
        daysUntilClose: number;
        company: string | null;
      }>;
    };
    pipelineMomentum: {
      wonCount: number;
      wonValue: number;
      lostCount: number;
      lostValue: number;
      winRate: number;
    };
  };
};

type DealRow = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  updated_at: string;
  expected_close_date: string | null;
  probability: number | null;
  company: { name: string } | null;
  contact: { id: string; name: string } | null;
};

type ContactRow = {
  id: string;
  name: string;
  company_name: string | null;
  status: string | null;
  last_contacted_at: string | null;
};

type NeverContactedRow = {
  id: string;
  name: string;
  company_name: string | null;
  created_at: string;
};

type TaskRow = {
  id: string;
  title: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string;
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

type CompanyRow = {
  id: string;
  name: string;
};

type ClosedDealRow = {
  stage: string;
  value: number | null;
};

const MS_PER_DAY = 86_400_000;

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

function computeDealHealth(
  probability: number | null,
  daysSinceUpdated: number,
  daysUntilClose: number | null,
  stage: string
): { healthScore: number; healthLabel: "Healthy" | "Warning" | "At Risk" } {
  const stageWeight = STAGE_WEIGHTS[stage.toLowerCase()] ?? 1.0;
  const base = probability != null ? probability : stageWeight * 50;
  const staleFactor = Math.max(0, 1 - daysSinceUpdated / 30);

  let urgencyFactor = 1.0;
  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) urgencyFactor = 0.5;
    else if (daysUntilClose === 0) urgencyFactor = 1.5;
    else if (daysUntilClose <= 7) urgencyFactor = 1.3;
    else if (daysUntilClose <= 14) urgencyFactor = 1.15;
  }

  const raw = base * staleFactor * urgencyFactor;
  const healthScore = Math.max(0, Math.min(100, Math.round(raw)));
  const healthLabel =
    healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Warning" : "At Risk";

  return { healthScore, healthLabel };
}

export async function getWorkspaceContext(): Promise<WorkspaceAIContext | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();
    const now = new Date().toISOString();
    const sevenDaysAhead = new Date(Date.now() + 7 * MS_PER_DAY).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * MS_PER_DAY).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * MS_PER_DAY).toISOString();

    const [
      workspaceResult,
      dealsResult,
      contactsResult,
      neverContactedResult,
      tasksResult,
      meetingsResult,
      emailsResult,
      activityResult,
      memoryResult,
      companiesResult,
      membersResult,
      closedDealsResult,
    ] = await Promise.all([
      supabase
        .from("workspaces")
        .select("name")
        .eq("id", workspace.id)
        .single(),
      supabase
        .from("workspace_deals")
        .select(
          "id, title, stage, value, updated_at, expected_close_date, probability, company:workspace_companies(name), contact:workspace_contacts(id, name)"
        )
        .eq("workspace_id", workspace.id)
        .neq("stage", "won")
        .neq("stage", "lost")
        .order("updated_at", { ascending: true })
        .limit(15),
      supabase
        .from("workspace_contacts")
        .select("id, name, company_name, status, last_contacted_at")
        .eq("workspace_id", workspace.id)
        .not("last_contacted_at", "is", null)
        .order("last_contacted_at", { ascending: true })
        .limit(20),
      supabase
        .from("workspace_contacts")
        .select("id, name, company_name, created_at")
        .eq("workspace_id", workspace.id)
        .is("last_contacted_at", null)
        .lte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: true })
        .limit(10),
      supabase
        .from("workspace_tasks")
        .select("id, title, priority, due_date, assigned_to")
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
        .select("id, name", { count: "exact" })
        .eq("workspace_id", workspace.id)
        .order("name", { ascending: true })
        .limit(50),
      supabaseAdmin
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_deals")
        .select("stage, value")
        .eq("workspace_id", workspace.id)
        .in("stage", ["won", "lost"])
        .gte("updated_at", thirtyDaysAgo),
    ]);

    const today = new Date();
    const nowMs = today.getTime();

    // Resolve task assignee names via batch profile fetch
    const rawTasks = ((tasksResult.data ?? []) as unknown as TaskRow[]);
    const assigneeIds = [...new Set(rawTasks.filter((t) => t.assigned_to).map((t) => t.assigned_to!))];
    const assigneeNameMap = new Map<string, string>();

    if (assigneeIds.length > 0) {
      const { data: profileRows } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", assigneeIds);
      ((profileRows ?? []) as unknown as ProfileRow[]).forEach((p) => {
        assigneeNameMap.set(p.id, p.full_name);
      });
    }

    const workspaceName =
      (workspaceResult.data as unknown as WorkspaceRow | null)?.name ??
      "Orbit Workspace";

    const companies = ((companiesResult.data ?? []) as unknown as CompanyRow[]);

    const deals = ((dealsResult.data ?? []) as unknown as DealRow[]).map((d) => {
      const closeMs = d.expected_close_date ? new Date(d.expected_close_date).getTime() : null;
      const daysUntilClose =
        closeMs !== null ? Math.ceil((closeMs - nowMs) / MS_PER_DAY) : null;
      const daysSinceUpdated = Math.floor((nowMs - new Date(d.updated_at).getTime()) / MS_PER_DAY);
      const { healthScore, healthLabel } = computeDealHealth(
        d.probability != null ? Number(d.probability) : null,
        daysSinceUpdated,
        daysUntilClose,
        d.stage
      );
      return {
        id: d.id,
        title: d.title,
        stage: d.stage,
        value: d.value != null ? Number(d.value) : null,
        company: d.company?.name ?? null,
        contactId: d.contact?.id ?? null,
        contactName: d.contact?.name ?? null,
        expectedCloseDate: d.expected_close_date ?? null,
        daysUntilClose,
        probability: d.probability != null ? Number(d.probability) : null,
        daysSinceUpdated,
        healthScore,
        healthLabel,
      };
    });

    const contacts = ((contactsResult.data ?? []) as unknown as ContactRow[]).map((c) => {
      const contactedMs = c.last_contacted_at ? new Date(c.last_contacted_at).getTime() : null;
      return {
        id: c.id,
        name: c.name,
        company: c.company_name ?? null,
        status: c.status ?? null,
        lastContactedAt: c.last_contacted_at ?? null,
        daysSinceContacted: contactedMs !== null ? Math.floor((nowMs - contactedMs) / MS_PER_DAY) : null,
      };
    });

    const neverContacted = ((neverContactedResult.data ?? []) as unknown as NeverContactedRow[]).map(
      (c) => ({
        id: c.id,
        name: c.name,
        company: c.company_name ?? null,
        ageInDays: Math.floor((nowMs - new Date(c.created_at).getTime()) / MS_PER_DAY),
      })
    );

    const tasks = rawTasks.map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      dueDate: t.due_date,
      isOverdue: t.due_date ? new Date(t.due_date) < today : false,
      assigneeId: t.assigned_to ?? null,
      assigneeName: t.assigned_to ? (assigneeNameMap.get(t.assigned_to) ?? null) : null,
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

    // Derived intelligence
    const stalledDeals = deals.filter((d) => d.daysSinceUpdated > 7);
    const revenueAtRisk = stalledDeals.reduce((s, d) => s + (d.value ?? 0), 0);

    const pastDueDeals = deals
      .filter((d) => d.daysUntilClose !== null && d.daysUntilClose < 0)
      .map((d) => ({
        id: d.id,
        title: d.title,
        company: d.company,
        value: d.value,
        daysPastDue: Math.abs(d.daysUntilClose!),
      }))
      .sort((a, b) => b.daysPastDue - a.daysPastDue);

    const pastDueRevenue = pastDueDeals.reduce((s, d) => s + (d.value ?? 0), 0);

    const upcomingClosings = deals
      .filter((d) => d.daysUntilClose !== null && d.daysUntilClose >= 0 && d.daysUntilClose <= 14)
      .map((d) => ({
        id: d.id,
        title: d.title,
        value: d.value,
        daysUntilClose: d.daysUntilClose!,
        probability: d.probability,
        company: d.company,
      }))
      .sort((a, b) => a.daysUntilClose - b.daysUntilClose);

    const upcomingRevenue = upcomingClosings.reduce((s, d) => {
      const weight = d.probability != null ? d.probability / 100 : 0.5;
      return s + (d.value ?? 0) * weight;
    }, 0);

    const neglectedContacts = contacts
      .filter((c) => c.daysSinceContacted !== null && c.daysSinceContacted > 14)
      .sort((a, b) => (b.daysSinceContacted ?? 0) - (a.daysSinceContacted ?? 0))
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        status: c.status,
        daysSinceContacted: c.daysSinceContacted!,
      }));

    const sevenDaysMs = 7 * MS_PER_DAY;
    const weeklyFocus = {
      tasks: tasks
        .filter((t) => !t.isOverdue && t.dueDate && new Date(t.dueDate).getTime() - nowMs <= sevenDaysMs)
        .slice(0, 5)
        .map((t) => ({ id: t.id, title: t.title, priority: t.priority, dueDate: t.dueDate! })),
      meetings: meetings,
      closings: upcomingClosings.filter((d) => d.daysUntilClose <= 7),
    };

    const closedDeals = ((closedDealsResult.data ?? []) as unknown as ClosedDealRow[]);
    const wonDeals = closedDeals.filter((d) => d.stage === "won");
    const lostDeals = closedDeals.filter((d) => d.stage === "lost");
    const wonCount = wonDeals.length;
    const lostCount = lostDeals.length;
    const wonValue = wonDeals.reduce((s, d) => s + (d.value != null ? Number(d.value) : 0), 0);
    const lostValue = lostDeals.reduce((s, d) => s + (d.value != null ? Number(d.value) : 0), 0);
    const winRate =
      wonCount + lostCount > 0
        ? Math.round((wonCount / (wonCount + lostCount)) * 100)
        : 0;

    return {
      workspaceName,
      analytics: {
        companies: companiesResult.count ?? 0,
        openDeals: deals.length,
        openTasks: tasks.length,
        members: membersResult.count ?? 0,
      },
      companies,
      deals,
      contacts,
      tasks,
      meetings,
      emails,
      activity,
      memory,
      derived: {
        stalledDealsCount: stalledDeals.length,
        revenueAtRisk,
        pastDueRevenue,
        upcomingRevenue: Math.round(upcomingRevenue),
        upcomingClosings,
        pastDueDeals,
        neglectedContacts,
        neverContactedContacts: neverContacted,
        weeklyFocus,
        pipelineMomentum: { wonCount, wonValue, lostCount, lostValue, winRate },
      },
    };
  } catch (error) {
    console.error("getWorkspaceContext failed:", error);
    return null;
  }
}
