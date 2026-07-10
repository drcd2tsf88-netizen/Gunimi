"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { TodayRawDeal, TodayRawContact, TodayRawTask } from "@/lib/today/types";

export type TodayDataResult = {
  deals: TodayRawDeal[];
  contacts: TodayRawContact[];
  tasks: TodayRawTask[];
};

const EMPTY: TodayDataResult = { deals: [], contacts: [], tasks: [] };

export async function getTodayData(): Promise<TodayDataResult> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();

    const [dealsResult, contactsResult, tasksResult] = await Promise.all([
      supabase
        .from("workspace_deals")
        .select(
          "id, title, stage, value, expected_close_date, updated_at, contact:workspace_contacts(id, name)"
        )
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("workspace_contacts")
        .select("id, name, last_contacted_at")
        .eq("workspace_id", workspace.id)
        .order("name", { ascending: true }),

      supabase
        .from("workspace_tasks")
        .select("id, title, status, priority, due_date")
        .eq("workspace_id", workspace.id)
        .neq("status", "done")
        .not("due_date", "is", null)
        .order("due_date", { ascending: true })
        .limit(50),
    ]);

    if (dealsResult.error) logger.error("getTodayData: deals", dealsResult.error);
    if (contactsResult.error) logger.error("getTodayData: contacts", contactsResult.error);
    if (tasksResult.error) logger.error("getTodayData: tasks", tasksResult.error);

    const activeStages = new Set(["lead", "qualified", "proposal", "negotiation"]);
    const rawDeals = (dealsResult.data ?? []) as unknown as TodayRawDeal[];

    return {
      deals: rawDeals.filter((d) => activeStages.has(d.stage)),
      contacts: (contactsResult.data ?? []) as TodayRawContact[],
      tasks: (tasksResult.data ?? []) as TodayRawTask[],
    };
  } catch {
    return EMPTY;
  }
}
