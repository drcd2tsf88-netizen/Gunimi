"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type CompanyNote = {
  id: string;
  title: string;
  content?: string | null;
  created_at: string;
};

export async function getCompanyNotes(companyId: string): Promise<CompanyNote[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_notes")
      .select("id, title, content, created_at")
      .eq("workspace_id", workspace.id)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("getCompanyNotes error:", error);
      return [];
    }

    return (data || []) as CompanyNote[];
  } catch (error) {
    console.error("getCompanyNotes failed:", error);
    return [];
  }
}
