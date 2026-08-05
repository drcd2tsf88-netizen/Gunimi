"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type CompanyTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  due_date?: string | null;
  created_at: string;
};

export async function getCompanyTasks(companyId: string): Promise<CompanyTask[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data: contacts, error: contactsError } = await supabase
      .from("workspace_contacts")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("company_id", companyId);

    if (contactsError) {
      logger.error("getCompanyTasks contacts error:", contactsError);
      return [];
    }

    const contactIds = (contacts ?? []).map((c) => c.id);
    if (!contactIds.length) return [];

    const { data, error } = await supabase
      .from("workspace_tasks")
      .select("id, title, description, status, priority, due_date, created_at")
      .eq("workspace_id", workspace.id)
      .in("contact_id", contactIds)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      logger.error("getCompanyTasks error:", error);
      return [];
    }

    return (data ?? []) as CompanyTask[];
  } catch (error) {
    logger.error("getCompanyTasks failed:", error);
    return [];
  }
}
