"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getCompany(
  companyId: string
) {
  try {

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }

    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase
      .from(
        "workspace_companies"
      )
      .select(`
        *,
        owner:profiles!owner_id(
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq(
        "workspace_id",
        workspace.id
      )
      .eq(
        "id",
        companyId
      )
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;

  } catch (error) {
    console.error(error);
    return null;
  }
}