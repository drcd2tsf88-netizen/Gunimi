"use server";

import { createClient }
from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

import { getUser }
from "@/server/actions/auth/getUser";

type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export async function updateDealStage(
  dealId: string,
  stage: DealStage
) {
  try {
    const user =
      await getUser();
      const workspace =
  await getCurrentWorkspace();


if (!workspace) {
  return false;
}

    if (!user) {
      return false;
    }
    const allowedStages: DealStage[] = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

if (
  !allowedStages.includes(
    stage
  )
) {
  return false;
}
type DealUpdatePayload = {
  stage: DealStage;
  updated_at: string;
  probability?: number;
};

const updateData: DealUpdatePayload = {
  stage,

  updated_at:
    new Date().toISOString(),
};

if (stage === "won") {
  updateData.probability =
    100;
}

if (stage === "lost") {
  updateData.probability =
    0;
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
    title,
    stage,
    workspace_id,
    company_id
  `)
  .eq(
    "id",
    dealId
  )
  .eq(
    "workspace_id",
    workspace.id
  )
  .single();

    if (!existingDeal) {
      return false;
    }

    const previousStage =
      existingDeal.stage;

    const { error } =
      await supabase
        .from(
          "workspace_deals"
        )
        .update(updateData)
        .eq(
          "id",
          dealId
        )
        .eq(
          "workspace_id",
          workspace.id
        );

    if (error) {
      console.error(error);

      return false;
    }

    let type =
      "deal_stage_changed";

    let title =
      "Opportunity Stage Updated";

    let description =
      `Moved from ${previousStage} to ${stage}`;

    if (
      stage === "won"
    ) {
      type =
        "deal_won";

      title =
        "Opportunity Won";

      description =
        `${existingDeal.title} closed successfully`;
    }

    if (
      stage === "lost"
    ) {
      type =
        "deal_lost";

      title =
        "Opportunity Lost";

      description =
        `${existingDeal.title} marked as lost`;
    }

   await supabaseAdmin
  .from(
    "workspace_activity"
  )
  .insert({
    workspace_id:
      existingDeal.workspace_id,

    company_id:
      existingDeal.company_id,

    deal_id:
      dealId,

    user_id:
      user.id,

    type,

    title,

    description,

    metadata: {
      previous_stage:
        previousStage,

      current_stage:
        stage,
    },
  });
    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
}