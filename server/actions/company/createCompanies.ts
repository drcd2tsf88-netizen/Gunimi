"use server";

import { revalidatePath }
from "next/cache";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export type CreateCompanyProps =
  {
    name: string;

    website?: string;

    industry?: string;

    companySize?: string;

    country?: string;

    annualValue?: number;
    notes?: string;
  };

export async function createCompany({
  name,
  website,
  industry,
  companySize,
  country,
  annualValue,
  notes
}: CreateCompanyProps) {
  try {
    const user =
      await getUser();

    if (!user) {
      return null;
    }

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
      .insert({
        workspace_id:
          workspace.id,

        owner_id:
          user.id,

        name:
          name.trim(),
          notes:
           notes?.trim() ||
          null,



        website:
          website?.trim() ||
          null,

        industry:
          industry?.trim() ||
          null,

        company_size:
          companySize?.trim() ||
          null,

        country:
          country?.trim() ||
          null,

        annual_value:
          annualValue || 0,

        relationship_stage:
          "prospect",

        status:
          "active",

        last_activity_at:
          new Date().toISOString(),
      })
      .select()
      .single();
      if (!name.trim()) {
  return null;
}

    if (error) {
      console.error(error);

      return null;
    }

    await supabase
      .from(
        "workspace_activity"
      )
      .insert({
        workspace_id:
          workspace.id,

        user_id:
          user.id,

        company_id:
          data.id,

        type:
          "company_created",

        title:
          "Organization Created",

        description:
          `${name} added to workspace`,
      });

    revalidatePath("/dashboard/companies");

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}