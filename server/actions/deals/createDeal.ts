"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export type CreateDealProps = {
  title: string;

  companyId?: string;

  contactId?: string;

  value?: number;

  probability?: number;

  description?: string;

  expectedCloseDate?: string;
};

export async function createDeal({
  title,
  companyId,
  contactId,
  value = 0,
  probability = 25,
  description,
  expectedCloseDate,
}: CreateDealProps) {
  try {
    if (!title.trim()) {
      return null;
    }
    if (
  probability < 0 ||
  probability > 100
) {
  return null;
}

if (value < 0) {
  return null;
}

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
      if (companyId) {
  const {
    data: company,
  } = await supabase
    .from(
      "workspace_companies"
    )
    .select("id")
    .eq(
      "workspace_id",
      workspace.id
    )
    .eq(
      "id",
      companyId
    )
    .single();

  if (!company) {
    return null;
  }
}

if (contactId) {
  const {
    data: contact,
  } = await supabase
    .from(
      "workspace_contacts"
    )
    .select("id")
    .eq(
      "workspace_id",
      workspace.id
    )
    .eq(
      "id",
      contactId
    )
    .single();

  if (!contact) {
    return null;
  }
}
probability =
  Math.round(
    probability
  );

    const {
      data: deal,
      error,
    } = await supabase
      .from(
        "workspace_deals"
      )
      .insert({
        workspace_id:
          workspace.id,

        owner_id:
          user.id,

        company_id:
          companyId || null,

        contact_id:
          contactId || null,

        title:
          title.trim(),
          

        value,

        probability,

        description:
          description?.trim() ||
          null,

        expected_close_date:
  expectedCloseDate
    ? new Date(
        expectedCloseDate
      ).toISOString()
    : null,
        stage:
          "lead",
      })
      .select()
      .single();

    if (
      error ||
      !deal
    ) {
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
      companyId || null,

    deal_id:
      deal.id,

    type:
      "deal_created",

    title:
      "deal_created",

    description:
      null,

    metadata: {
      deal_id:
        deal.id,

      stage:
        "lead",
    },
  });

    if (contactId) {
      await supabase
        .from(
          "workspace_contact_activity"
        )
        .insert({
          workspace_id:
            workspace.id,

          contact_id:
            contactId,

          type:
            "deal.created",

          title:
            "Opportunity Created",

          description:
            `Opportunity "${title}" linked to contact`,
        });
    }

    return deal;
  } catch (error) {
    console.error(error);

    return null;
  }
}