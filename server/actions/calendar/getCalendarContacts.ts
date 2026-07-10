"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type CalendarContact = {
  id: string;
  name: string;
  email: string | null;
  company_id: string | null;
  company_name: string | null;
};

type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  company_id: string | null;
  companies: { name: string }[] | { name: string } | null;
};

export async function getCalendarContacts(): Promise<CalendarContact[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const { data, error } = await supabaseAdmin
      .from("workspace_contacts")
      .select(`
        id,
        name,
        email,
        company_id,
        companies:workspace_companies (
          name
        )
      `)
      .eq("workspace_id", workspace.id)
      .not("email", "is", null);

    if (error) {
      logger.error("getCalendarContacts error:", error);
      return [];
    }

    return ((data ?? []) as unknown as ContactRow[]).map((row) => {
      const co = row.companies;
      const companyName = Array.isArray(co) ? (co[0]?.name ?? null) : (co?.name ?? null);
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        company_id: row.company_id,
        company_name: companyName,
      };
    });
  } catch {
    return [];
  }
}
