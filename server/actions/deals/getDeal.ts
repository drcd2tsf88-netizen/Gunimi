"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { Deal } from "@/types/deal";
import { WorkspaceActivity } from "@/types/activity";
import { logger } from "@/lib/logger";

export async function getDeal(
  dealId: string
) {
  try {
    if (!dealId) {
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
      data: deal,
      error: dealError,
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
          name,
          website,
          industry,
          country
        ),

        contact:workspace_contacts(
          id,
          name,
          email,
          phone
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
      .eq(
        "id",
        dealId
      )
      .maybeSingle();

    if (
      dealError ||
      !deal
    ) {
      logger.error(
        dealError
      );

      return null;
    }

    const {
      data: activities,
      error: activitiesError,
    } = await supabase
      .from(
        "workspace_activity"
      )
     .select(`
  id,
  workspace_id,
  company_id,
  deal_id,
  user_id,
  type,
  title,
  description,
  metadata,
  created_at,

  user:profiles!user_id(
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
        "deal_id",
        dealId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (
      activitiesError
    ) {
      logger.error(
        activitiesError
      );
    }

    return {
      deal: deal as unknown as Deal,

      activities:
        (activities || []) as unknown as WorkspaceActivity[],
    };
  } catch (error) {
    logger.error(error);

    return null;
  }
}