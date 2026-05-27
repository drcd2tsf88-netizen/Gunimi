"use server";

import { createClient }
from "@/lib/supabase/server";

export async function initializeWorkspace(
  userId: string
) {
  try {
    if (!userId) {
      console.error(
        "Missing userId"
      );

      return null;
    }
    const supabase =
      await createClient();

    // CHECK EXISTING MEMBERSHIP

    const {
      data: existingMembership,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .maybeSingle();

    // ALREADY EXISTS

    if (existingMembership) {
      return existingMembership;
    }

    // CREATE WORKSPACE

    const {
      data: workspace,
      error:
        workspaceError,
    } =
      await supabase
        .from("workspaces")
        .insert({
          name:
            "Orbit Workspace",

          slug: `orbit-${userId.slice(
            0,
            8
          )}`,
        })
        .select()
        .single();

    if (
      workspaceError ||
      !workspace
    ) {
      console.error(
        "Workspace creation failed:",
        workspaceError
      );

      return null;
    }

    // CREATE MEMBERSHIP

    const {
      data: membership,
      error:
        membershipError,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .insert({
          workspace_id:
            workspace.id,

          user_id:
            userId,

          role: "owner",
        })
        .select()
        .single();

    if (
      membershipError ||
      !membership
    ) {
      console.error(
        "Membership creation failed:",
        membershipError
      );

      return null;
    }

    console.log(
      "Workspace initialized"
    );

    return {
      workspace,
      membership,
    };
  } catch (error) {
    console.error(
      "initializeWorkspace error:",
      error
    );

    return null;
  }
}