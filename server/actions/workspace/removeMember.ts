"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function removeMember(memberId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { data: currentMembership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!currentMembership || !["owner", "admin"].includes(currentMembership.role)) {
      return false;
    }

    const { data: targetMember } = await supabase
      .from("workspace_members")
      .select("role, user_id")
      .eq("id", memberId)
      .eq("workspace_id", workspace.id)
      .maybeSingle();

    if (!targetMember || targetMember.role === "owner") return false;

    // admins can only remove members, not other admins
    if (currentMembership.role === "admin" && targetMember.role === "admin") return false;

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", targetMember.user_id)
      .maybeSingle();

    const { error, count } = await supabaseAdmin
      .from("workspace_members")
      .delete({ count: "exact" })
      .eq("id", memberId)
      .eq("workspace_id", workspace.id);

    if (error) {
      console.error(error);
      return false;
    }

    if (!count || count === 0) {
      console.error("removeMember: no rows deleted for member", memberId);
      return false;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "member_removed",
        title: "Member Removed",
        description: `Removed ${targetProfile?.email ?? "a member"} from workspace`,
      });

    return true;
  } catch {
    return false;
  }
}
