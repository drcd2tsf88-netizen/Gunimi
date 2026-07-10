"use server";

import { cookies }
from "next/headers";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";
import { logger } from "@/lib/logger";

export async function setActiveWorkspace(
  workspaceId: string
): Promise<boolean> {
  try {
    const user = await getUser();

    if (!user) {
      return false;
    }

    const supabase = await createClient();

    // Verify the user is actually a member of this workspace
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (!membership) {
      logger.error("setActiveWorkspace: user is not a member of workspace", workspaceId);
      return false;
    }

    const cookieStore = await cookies();

    cookieStore.set("orbit_workspace_id", workspaceId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return true;
  } catch (error) {
    logger.error("setActiveWorkspace failed:", error);
    return false;
  }
}
