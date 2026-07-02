"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";

type CreateWorkspaceParams = {
  name: string;
};

type CreatedWorkspace = {
  id: string;
  name: string;
  slug: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(base: string): Promise<string> {
  const candidate = base || "workspace";

  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("slug")
    .eq("slug", candidate)
    .maybeSingle();

  if (!data) return candidate;

  // Append random 4-char suffix
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${candidate}-${suffix}`;
}

export async function createWorkspace({
  name,
}: CreateWorkspaceParams): Promise<CreatedWorkspace | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    if (!await checkWriteRateLimit(user.id)) return null;

    const trimmedName = name?.trim();
    if (!trimmedName) return null;

    const slug = await uniqueSlug(slugify(trimmedName));

    // CREATE WORKSPACE — use supabaseAdmin to bypass RLS
    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .insert({
        name: trimmedName,
        slug,
      })
      .select("id, name, slug")
      .single();

    if (workspaceError || !workspace) {
      console.error("createWorkspace: workspace insert failed", workspaceError);
      return null;
    }

    // CREATE MEMBERSHIP — owner role
    const { error: membershipError } = await supabaseAdmin
      .from("workspace_members")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });

    if (membershipError) {
      console.error("createWorkspace: membership insert failed", membershipError);
      // Clean up the workspace row to avoid orphaned workspaces
      await supabaseAdmin.from("workspaces").delete().eq("id", workspace.id);
      return null;
    }

    // ACTIVITY EVENT
    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "workspace_created",
      title: "Workspace Created",
      description: `Created workspace ${trimmedName}`,
    });

    return workspace;
  } catch (error) {
    console.error("createWorkspace failed:", error);
    return null;
  }
}
