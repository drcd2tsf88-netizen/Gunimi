"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export async function getContacts() {
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
        name,
        email,
        phone,
        position,
        assigned_to
      `)
      .eq(
        "workspace_id",
        workspace.id
      )
      .order(
        "name",
        {
          ascending: true,
        }
      );

    if (error) {
      logger.error(error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error(error);
    return [];
  }
}