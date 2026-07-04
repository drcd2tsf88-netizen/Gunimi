"use server";

import { createClient }
from "@/lib/supabase/server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

export async function initializeWorkspace(
  userId: string
) {
  try {
    if (!userId) {
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

    // CREATE WORKSPACE — always use supabaseAdmin to bypass RLS.
    // The workspace row doesn't exist yet so member-scoped policies cannot pass.

    const {
      data: workspace,
      error:
        workspaceError,
    } =
      await supabaseAdmin
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
      return null;
    }

    // CREATE MEMBERSHIP — use supabaseAdmin for the same reason.

    const {
      data: membership,
      error:
        membershipError,
    } =
      await supabaseAdmin
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
      // Clean up orphaned workspace row
      await supabaseAdmin.from("workspaces").delete().eq("id", workspace.id);
      return null;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: userId,
        type: "workspace_created",
        title: "Workspace Created",
        description: `Created workspace ${workspace.name}`,
      });

    return {
      workspace,
      membership,
    };
  } catch {
    return null;
  }
}