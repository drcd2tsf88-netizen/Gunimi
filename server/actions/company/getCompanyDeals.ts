"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getCompanyDeals(
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
        "workspace_deals"
      )
      .select(`
        *,
        owner:profiles!owner_id(
          id,
          full_name,
          avatar_url
        )
      `)
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
      );

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