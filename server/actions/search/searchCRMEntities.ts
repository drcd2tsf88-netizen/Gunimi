"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  position: string | null;
};

export type CompanyRow = {
  id: string;
  name: string;
};

export type CRMEntityRows = {
  contacts: ContactRow[];
  companies: CompanyRow[];
};

const EMPTY: CRMEntityRows = { contacts: [], companies: [] };

export async function searchCRMEntities(
  query: string
): Promise<CRMEntityRows> {
  if (!query.trim()) return EMPTY;

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();
    const pattern = `%${query}%`;

    const [contactsResult, companiesResult] = await Promise.all([
      supabase
        .from("workspace_contacts")
        .select("id, name, email, position")
        .eq("workspace_id", workspace.id)
        .or(`name.ilike.${pattern},email.ilike.${pattern}`)
        .order("name", { ascending: true })
        .limit(5),

      supabase
        .from("workspace_companies")
        .select("id, name")
        .eq("workspace_id", workspace.id)
        .ilike("name", pattern)
        .order("name", { ascending: true })
        .limit(5),
    ]);

    if (contactsResult.error) {
      console.error("[searchCRMEntities] contacts query failed:", contactsResult.error);
    }

    if (companiesResult.error) {
      console.error("[searchCRMEntities] companies query failed:", companiesResult.error);
    }

    return {
      contacts: (contactsResult.data ?? []) as ContactRow[],
      companies: (companiesResult.data ?? []) as CompanyRow[],
    };
  } catch (err) {
    console.error("[searchCRMEntities] unexpected error:", err);
    return EMPTY;
  }
}
