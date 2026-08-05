"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type DashboardContact = {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
};

export type DashboardDeal = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  contact_name: string | null;
  company_name: string | null;
  created_at: string;
};

export type DashboardDealStage = {
  stage: string;
  count: number;
  total_value: number;
};

export type DashboardTask = {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  due_date: string | null;
};

export type DashboardNote = {
  id: string;
  title: string;
  created_at: string;
};

export type DashboardActivity = {
  id: string;
  type: string;
  title: string;
  created_at: string;
};

export type DashboardData = {
  contactsTotal: number;
  companiesTotal: number;
  recentContacts: DashboardContact[];
  pipelineValue: number;
  wonMtdCount: number;
  wonMtdValue: number;
  activeDeals: DashboardDeal[];
  dealsByStage: DashboardDealStage[];
  tasksToday: DashboardTask[];
  tasksTodayCount: number;
  tasksOverdueCount: number;
  tasksWeek: DashboardTask[];
  recentNotes: DashboardNote[];
  recentActivity: DashboardActivity[];
};

const EMPTY: DashboardData = {
  contactsTotal: 0,
  companiesTotal: 0,
  recentContacts: [],
  pipelineValue: 0,
  wonMtdCount: 0,
  wonMtdValue: 0,
  activeDeals: [],
  dealsByStage: [],
  tasksToday: [],
  tasksTodayCount: 0,
  tasksOverdueCount: 0,
  tasksWeek: [],
  recentNotes: [],
  recentActivity: [],
};

function localDate(date: Date, timezone?: string | null): string {
  if (!timezone) return date.toISOString().slice(0, 10);
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();
    const wid = workspace.id;

    const [
      contactsRes,
      companiesRes,
      dealsRes,
      tasksRes,
      notesRes,
      activityRes,
      prefsRes,
    ] = await Promise.all([
      supabase
        .from("workspace_contacts")
        .select("id, name, email, created_at")
        .eq("workspace_id", wid)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("workspace_companies")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", wid),

      supabase
        .from("workspace_deals")
        .select(`
          id, title, stage, value, created_at,
          contact:workspace_contacts(name),
          company:workspace_companies(name)
        `)
        .eq("workspace_id", wid)
        .order("created_at", { ascending: false }),

      supabase
        .from("workspace_tasks")
        .select("id, title, status, priority, due_date")
        .eq("workspace_id", wid)
        .neq("status", "done"),

      supabase
        .from("workspace_notes")
        .select("id, title, created_at")
        .eq("workspace_id", wid)
        .order("created_at", { ascending: false })
        .limit(4),

      supabase
        .from("workspace_activity")
        .select("id, type, title, created_at")
        .eq("workspace_id", wid)
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("workspaces")
        .select("preferences")
        .eq("id", wid)
        .maybeSingle(),
    ]);

    const timezone = (prefsRes.data?.preferences as { timezone?: string } | null)?.timezone ?? null;
    const now = new Date();
    const todayStr = localDate(now, timezone);
    const monthStart = localDate(new Date(now.getFullYear(), now.getMonth(), 1), timezone);
    const weekEnd = localDate(new Date(now.getTime() + 7 * 86400_000), timezone);

    if (contactsRes.error) logger.error("getDashboardData contacts:", contactsRes.error);
    if (dealsRes.error) logger.error("getDashboardData deals:", dealsRes.error);
    if (tasksRes.error) logger.error("getDashboardData tasks:", tasksRes.error);

    const contacts = (contactsRes.data ?? []) as DashboardContact[];
    const contactsTotal = contacts.length; // approximate — we only fetch 5 for recency

    // Get real total count
    const { count: totalContactCount } = await supabase
      .from("workspace_contacts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", wid);

    const companiesTotal = companiesRes.count ?? 0;

    const rawDeals = (dealsRes.data ?? []) as unknown as Array<{
      id: string;
      title: string;
      stage: string;
      value: number | null;
      created_at: string;
      contact: { name: string } | null;
      company: { name: string } | null;
    }>;

    const activeDeals: DashboardDeal[] = rawDeals
      .filter((d) => d.stage !== "won" && d.stage !== "lost")
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        title: d.title,
        stage: d.stage,
        value: d.value,
        contact_name: d.contact?.name ?? null,
        company_name: d.company?.name ?? null,
        created_at: d.created_at,
      }));

    const pipelineValue = rawDeals
      .filter((d) => d.stage !== "won" && d.stage !== "lost")
      .reduce((sum, d) => sum + (d.value ?? 0), 0);

    const wonDeals = rawDeals.filter(
      (d) => d.stage === "won" && d.created_at.slice(0, 10) >= monthStart
    );
    const wonMtdCount = wonDeals.length;
    const wonMtdValue = wonDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);

    // Deals by stage
    const stageMap = new Map<string, { count: number; total_value: number }>();
    for (const d of rawDeals.filter((d) => d.stage !== "won" && d.stage !== "lost")) {
      const existing = stageMap.get(d.stage) ?? { count: 0, total_value: 0 };
      stageMap.set(d.stage, {
        count: existing.count + 1,
        total_value: existing.total_value + (d.value ?? 0),
      });
    }
    const dealsByStage: DashboardDealStage[] = Array.from(stageMap.entries()).map(
      ([stage, { count, total_value }]) => ({ stage, count, total_value })
    );

    const allTasks = (tasksRes.data ?? []) as DashboardTask[];
    const tasksToday = allTasks.filter(
      (t) => t.due_date && t.due_date.slice(0, 10) === todayStr
    );
    const tasksTodayCount = tasksToday.length;
    const tasksOverdueCount = allTasks.filter(
      (t) => t.due_date && t.due_date.slice(0, 10) < todayStr && t.status !== "done"
    ).length;
    const tasksWeek = allTasks.filter(
      (t) =>
        t.due_date &&
        t.due_date.slice(0, 10) >= todayStr &&
        t.due_date.slice(0, 10) <= weekEnd
    );

    const recentNotes = (notesRes.data ?? []) as DashboardNote[];
    const recentActivity = (activityRes.data ?? []) as DashboardActivity[];

    return {
      contactsTotal: totalContactCount ?? contactsTotal,
      companiesTotal,
      recentContacts: contacts,
      pipelineValue,
      wonMtdCount,
      wonMtdValue,
      activeDeals,
      dealsByStage,
      tasksToday,
      tasksTodayCount,
      tasksOverdueCount,
      tasksWeek,
      recentNotes,
      recentActivity,
    };
  } catch (err) {
    logger.error("getDashboardData failed:", err);
    return EMPTY;
  }
}
