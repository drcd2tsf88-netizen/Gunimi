"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type DeleteResult = { ok: boolean; error?: string };

export async function deleteWorkspace(): Promise<DeleteResult> {
  try {
    const user = await getUser();
    if (!user) return { ok: false, error: "unauthorized" };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { ok: false, error: "no_workspace" };

    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership?.role !== "owner") {
      return { ok: false, error: "not_owner" };
    }

    const { error, count } = await supabaseAdmin
      .from("workspaces")
      .delete({ count: "exact" })
      .eq("id", workspace.id);

    if (error) {
      console.error(error);
      return { ok: false, error: "db_error" };
    }

    if (!count || count === 0) {
      console.error("deleteWorkspace: no rows deleted for workspace", workspace.id);
      return { ok: false, error: "not_deleted" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
