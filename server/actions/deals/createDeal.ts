"use server";

import { revalidatePath } from "next/cache";

import { createClient }
from "@/lib/supabase/server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getUser }
from "@/server/actions/auth/getUser";

import { checkWriteRateLimit }
from "@/lib/server/rateLimit";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { executeAutomations } from "@/lib/automation/engine";
import { logger } from "@/lib/logger";
import { produceDealSignals } from "@/lib/signals/producers/dealProducer";

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

    if (!await checkWriteRateLimit(user.id)) return null;

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
    .maybeSingle();

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
    .maybeSingle();

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
      logger.error(error);

      return null;
    }

    const {
      error: activityError,
    } = await supabaseAdmin
      .from(
        "workspace_activity"
      )
      .insert({
        workspace_id:
          workspace.id,

        user_id:
          user.id,

        type:
          "deal_created",

        title:
          "Opportunity Created",

        description:
          `"${title}" added to pipeline`,

        company_id:
          companyId || null,

        contact_id:
          contactId || null,

        deal_id:
          deal.id,
      });

    if (activityError) {
      logger.error(
        "deal activity insert failed:",
        activityError
      );
    }

    await executeAutomations("deal.created", {
      workspaceId: workspace.id,
      userId: user.id,
      dealId: deal.id,
      dealTitle: title.trim(),
      companyId: companyId ?? null,
      contactId: contactId ?? null,
    });

    await produceDealSignals({
      workspaceId: workspace.id,
      dealId: deal.id,
      stage: deal.stage,
      value: deal.value ?? null,
      expectedCloseDate: deal.expected_close_date ?? null,
      updatedAt: deal.updated_at ?? null,
      contactId: deal.contact_id ?? null,
      companyId: deal.company_id ?? null,
      title: deal.title,
    });

    revalidatePath("/dashboard/deals");
    revalidatePath("/dashboard");

    return deal;
  } catch (error) {
    logger.error(error);

    return null;
  }
}