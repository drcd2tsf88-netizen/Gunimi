"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { Company } from "@/types/company";
import { logger } from "@/lib/logger";

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
      .maybeSingle();

    if (error) {
      logger.error(error);
      return null;
    }

    return data as unknown as Company;

  } catch (error) {
    logger.error(error);
    return null;
  }
}