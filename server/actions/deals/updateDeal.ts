"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { revalidatePath }
from "next/cache";

export type UpdateDealProps = {
  dealId: string;

  title: string;

  companyId?: string;

  contactId?: string;

  value?: number;

  probability?: number;

  description?: string;

  expectedCloseDate?: string;

  lostReason?: string;
};

export async function updateDeal({
  dealId,
  title,
  companyId,
  contactId,
  value = 0,
  probability = 25,
  description,
  expectedCloseDate,
  lostReason,
}: UpdateDealProps) {
  try {
    if (!dealId) {
      return null;
    }

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

    const {
      data: existingDeal,
    } = await supabase
      .from(
        "workspace_deals"
      )
      .select(`
        id,
        workspace_id,
        company_id,
        title
      `)
      .eq(
        "workspace_id",
        workspace.id
      )
      .eq(
        "id",
        dealId
      )
      .single();

    if (!existingDeal) {
      return null;
    }

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
      .update({
        title:
          title.trim(),

        company_id:
          companyId || null,

        contact_id:
          contactId || null,

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

        lost_reason:
          lostReason?.trim() ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "workspace_id",
        workspace.id
      )
      .eq(
        "id",
        dealId
      )
      .select()
      .single();

    if (
      error ||
      !deal
    ) {
      console.error(error);

      return null;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        company_id: deal.company_id,
        contact_id: deal.contact_id || null,
        deal_id: deal.id,
        type: "deal_updated",
        title: "Opportunity Updated",
        description: `Updated deal "${deal.title}"`,
      });

    revalidatePath("/dashboard/deals");
    revalidatePath(`/dashboard/deals/${deal.id}`);

    return deal;

  } catch (error) {
    console.error(error);

    return null;
  }
}