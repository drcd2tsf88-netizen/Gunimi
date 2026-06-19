"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getCRMContacts() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }

    const supabase =
      await createClient();

    const { data, error } =
      await supabase
        .from("workspace_contacts")
        .select(`
          *,
          companies:workspace_companies (
            name
          )
        `)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false });

    if (error) {
      console.error("getCRMContacts error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getCRMContacts failed:", error);
    return [];
  }
}
