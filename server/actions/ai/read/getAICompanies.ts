"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AICompany = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  status: string | null;
};

type RawCompanyRow = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  status: string | null;
};

export async function getAICompanies(): Promise<AICompany[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_companies")
      .select("id, name, industry, website, status")
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as RawCompanyRow[]).map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry ?? null,
      website: c.website ?? null,
      status: c.status ?? null,
    }));
  } catch {
    return [];
  }
}
