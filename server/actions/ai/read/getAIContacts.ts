"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

const MS_PER_DAY = 86_400_000;

export type AIContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company: string | null;
  status: string | null;
  lastContactedAt: string | null;
  daysSinceContacted: number | null;
  isNeglected: boolean;
  neverContacted: boolean;
  createdAt: string;
};

type RawContactRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company_name: string | null;
  status: string | null;
  last_contacted_at: string | null;
  created_at: string;
};

export async function getAIContacts(): Promise<AIContact[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_contacts")
      .select(
        "id, name, email, phone, position, company_name, status, last_contacted_at, created_at"
      )
      .eq("workspace_id", workspace.id)
      .order("last_contacted_at", { ascending: true, nullsFirst: true });

    if (error || !data) return [];

    const now = Date.now();

    return (data as unknown as RawContactRow[]).map((c) => {
      const contactedMs = c.last_contacted_at
        ? new Date(c.last_contacted_at).getTime()
        : null;
      const daysSinceContacted =
        contactedMs !== null
          ? Math.floor((now - contactedMs) / MS_PER_DAY)
          : null;
      const ageInDays = Math.floor(
        (now - new Date(c.created_at).getTime()) / MS_PER_DAY
      );

      return {
        id: c.id,
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
        position: c.position ?? null,
        company: c.company_name ?? null,
        status: c.status ?? null,
        lastContactedAt: c.last_contacted_at ?? null,
        daysSinceContacted,
        isNeglected: daysSinceContacted !== null && daysSinceContacted > 14,
        neverContacted: c.last_contacted_at === null && ageInDays > 7,
        createdAt: c.created_at,
      };
    });
  } catch {
    return [];
  }
}
