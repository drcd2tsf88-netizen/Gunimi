"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type StaleDeal = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  daysSinceUpdate: number;
};

export type ContactNeedingOutreach = {
  id: string;
  name: string;
  company_name: string | null;
  daysSinceContact: number | null;
};

export type RecentWin = {
  id: string;
  title: string;
  value: number | null;
};

export type CompanyWithoutActivity = {
  id: string;
  name: string;
  daysSinceActivity: number | null;
};

export type DashboardInsights = {
  staleDeals: StaleDeal[];
  contactsNeedingOutreach: ContactNeedingOutreach[];
  recentWins: RecentWin[];
  companiesWithoutActivity: CompanyWithoutActivity[];
};

const FALLBACK: DashboardInsights = {
  staleDeals: [],
  contactsNeedingOutreach: [],
  recentWins: [],
  companiesWithoutActivity: [],
};

const MS_PER_DAY = 86_400_000;

export async function getDashboardInsights(): Promise<DashboardInsights> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const now = Date.now();
    const staleThreshold = new Date(now - 14 * MS_PER_DAY).toISOString();
    const outreachThreshold = new Date(now - 30 * MS_PER_DAY).toISOString();
    const winWindowStart = new Date(now - 7 * MS_PER_DAY).toISOString();
    const activityThreshold = new Date(now - 30 * MS_PER_DAY).toISOString();

    const [dealsRes, contactsRes, winsRes, companiesRes] = await Promise.all([
      supabaseAdmin
        .from("workspace_deals")
        .select("id, title, stage, value, updated_at")
        .eq("workspace_id", workspace.id)
        .not("stage", "in", "(won,lost)")
        .lt("updated_at", staleThreshold)
        .order("updated_at", { ascending: true })
        .limit(3),

      supabaseAdmin
        .from("workspace_contacts")
        .select("id, name, company_name, last_contacted_at")
        .eq("workspace_id", workspace.id)
        .or(`last_contacted_at.is.null,last_contacted_at.lt.${outreachThreshold}`)
        .order("last_contacted_at", { ascending: true, nullsFirst: true })
        .limit(3),

      supabaseAdmin
        .from("workspace_deals")
        .select("id, title, value")
        .eq("workspace_id", workspace.id)
        .eq("stage", "won")
        .gte("updated_at", winWindowStart)
        .order("updated_at", { ascending: false })
        .limit(3),

      supabaseAdmin
        .from("workspace_companies")
        .select("id, name, last_activity_at")
        .eq("workspace_id", workspace.id)
        .or(`last_activity_at.is.null,last_activity_at.lt.${activityThreshold}`)
        .order("last_activity_at", { ascending: true, nullsFirst: true })
        .limit(3),
    ]);

    const staleDeals: StaleDeal[] = (dealsRes.data ?? []).map((d) => ({
      id: d.id as string,
      title: (d.title as string) ?? "Untitled",
      stage: (d.stage as string) ?? "",
      value: d.value != null ? Number(d.value) : null,
      daysSinceUpdate: Math.floor(
        (now - new Date(d.updated_at as string).getTime()) / MS_PER_DAY
      ),
    }));

    const contactsNeedingOutreach: ContactNeedingOutreach[] = (
      contactsRes.data ?? []
    ).map((c) => ({
      id: c.id as string,
      name: (c.name as string) ?? "Unknown",
      company_name: (c.company_name as string | null) ?? null,
      daysSinceContact: c.last_contacted_at
        ? Math.floor(
            (now - new Date(c.last_contacted_at as string).getTime()) /
              MS_PER_DAY
          )
        : null,
    }));

    const recentWins: RecentWin[] = (winsRes.data ?? []).map((d) => ({
      id: d.id as string,
      title: (d.title as string) ?? "Untitled",
      value: d.value != null ? Number(d.value) : null,
    }));

    const companiesWithoutActivity: CompanyWithoutActivity[] = (
      companiesRes.data ?? []
    ).map((c) => ({
      id: c.id as string,
      name: (c.name as string) ?? "Unknown",
      daysSinceActivity: c.last_activity_at
        ? Math.floor(
            (now - new Date(c.last_activity_at as string).getTime()) /
              MS_PER_DAY
          )
        : null,
    }));

    return {
      staleDeals,
      contactsNeedingOutreach,
      recentWins,
      companiesWithoutActivity,
    };
  } catch {
    return FALLBACK;
  }
}
