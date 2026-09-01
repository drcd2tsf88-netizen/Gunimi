"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { computeContactHealth, type HealthScore } from "@/lib/relationships/healthScore";
import { logger } from "@/lib/logger";

export type ContactsHealthMap = Record<string, HealthScore>;

export async function getContactsHealthMap(): Promise<ContactsHealthMap> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return {};

    const wid = workspace.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();

    // 1. All contact IDs in this workspace
    const { data: people } = await supabaseAdmin
      .from("workspace_people")
      .select("id")
      .eq("workspace_id", wid);

    if (!people || people.length === 0) return {};

    const contactIds = people.map((p: { id: string }) => p.id);

    // 2. Parallel: email threads, open tasks, deals
    const [emailsRes, tasksRes, dealsRes] = await Promise.all([
      supabaseAdmin
        .from("email_threads")
        .select("contact_id, last_message_at")
        .in("contact_id", contactIds),
      supabaseAdmin
        .from("workspace_tasks")
        .select("contact_id")
        .in("contact_id", contactIds)
        .neq("status", "done"),
      supabaseAdmin
        .from("workspace_deals")
        .select("contact_id")
        .in("contact_id", contactIds),
    ]);

    // Aggregate per contact
    type EmailRow = { contact_id: string; last_message_at: string | null };
    const emailsByContact = new Map<string, EmailRow[]>();
    for (const row of (emailsRes.data ?? []) as EmailRow[]) {
      const list = emailsByContact.get(row.contact_id) ?? [];
      list.push(row);
      emailsByContact.set(row.contact_id, list);
    }

    const openTaskCount = new Map<string, number>();
    for (const row of (tasksRes.data ?? []) as { contact_id: string }[]) {
      if (!row.contact_id) continue;
      openTaskCount.set(row.contact_id, (openTaskCount.get(row.contact_id) ?? 0) + 1);
    }

    const dealCount = new Map<string, number>();
    for (const row of (dealsRes.data ?? []) as { contact_id: string | null }[]) {
      if (!row.contact_id) continue;
      dealCount.set(row.contact_id, (dealCount.get(row.contact_id) ?? 0) + 1);
    }

    const map: ContactsHealthMap = {};

    for (const id of contactIds) {
      const threads = emailsByContact.get(id) ?? [];

      const lastEmailAt = threads.reduce<string | null>((best, t) => {
        if (!t.last_message_at) return best;
        if (!best) return t.last_message_at;
        return t.last_message_at > best ? t.last_message_at : best;
      }, null);

      const emailsLast30d = threads.filter(
        (t) => t.last_message_at && t.last_message_at >= thirtyDaysAgo
      ).length;

      map[id] = computeContactHealth({
        lastEmailAt,
        emailsLast30d,
        openTasks: openTaskCount.get(id) ?? 0,
        totalDeals: dealCount.get(id) ?? 0,
      });
    }

    return map;
  } catch (err) {
    logger.error("getContactsHealthMap failed:", err);
    return {};
  }
}
