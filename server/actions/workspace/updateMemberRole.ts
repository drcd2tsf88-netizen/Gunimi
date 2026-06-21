"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function updateMemberRole(memberId: string, role: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: currentMembership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (currentMembership?.role !== "owner") return false;

    const { data: targetMember } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("id", memberId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!targetMember || targetMember.role === "owner") return false;

    const { error, count } = await supabaseAdmin
      .from("workspace_members")
      .update({ role }, { count: "exact" })
      .eq("id", memberId)
      .eq("workspace_id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    if (!count || count === 0) {
      console.error("updateMemberRole: no rows updated for member", memberId);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
