"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getCompanyContacts(
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
        "workspace_contacts"
      )
      .select(`
  id,
  company_id,
  workspace_id,
  name,
  email,
  phone,
  company_name,
  position,
  notes,
  status,
  last_contacted_at,
  created_at,
  updated_at,
  assigned_to,

  owner:profiles!assigned_to(
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