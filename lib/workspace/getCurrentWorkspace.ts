"use server";

import { cookies }
from "next/headers";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

type Workspace = {
  id: string;
  name: string;
  slug: string;
};

export async function getCurrentWorkspace():
Promise<Workspace | null> {
  const supabase =
    await createClient();

  try {
    const user =
      await getUser();

    if (!user) {
      logger.error(
        "No authenticated user"
      );

      return null;
    }

    // CHECK FOR PREFERRED WORKSPACE COOKIE

    const cookieStore =
      await cookies();

    const preferredId =
      cookieStore.get(
        "orbit_workspace_id"
      )?.value;

    if (preferredId) {
      const {
        data: preferred,
      } = await supabase
        .from("workspace_members")
        .select(`
          workspace_id,
          workspaces (
            id,
            name,
            slug
          )
        `)
        .eq("user_id", user.id)
        .eq("workspace_id", preferredId)
        .maybeSingle();

      if (preferred?.workspaces) {
        return preferred.workspaces as unknown as Workspace;
      }
    }

    // FALLBACK: FIRST WORKSPACE BY MEMBERSHIP DATE

    const {
      data: membership,
      error,
    } = await supabase
      .from("workspace_members")
      .select(`
        workspace_id,
        workspaces (
          id,
          name,
          slug
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      logger.error(error);
      return null;
    }

    if (!membership?.workspaces) {
      logger.error("No workspace found");
      return null;
    }

    return membership.workspaces as unknown as Workspace;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
