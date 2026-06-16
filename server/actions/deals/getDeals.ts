"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getDeals() {
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
  id,
  workspace_id,
  company_id,
  contact_id,
  owner_id,
  title,
  description,
  value,
  probability,
  stage,
  expected_close_date,
  lost_reason,
  created_at,
  updated_at,

  company:workspace_companies(
    id,
    name
  ),

  contact:workspace_contacts(
    id,
    name,
    email
  ),

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