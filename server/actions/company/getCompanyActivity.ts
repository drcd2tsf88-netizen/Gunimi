"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getCompanyActivity(
  companyId: string
) {
  try {

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }

    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase
      .from(
        "workspace_activity"
      )
      .select("*")
      .eq(
        "workspace_id",
        workspace.id
      )
      .eq(
        "company_id",
        companyId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(50);

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error(error);
    return [];
  }
}