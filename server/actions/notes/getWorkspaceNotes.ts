"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { getUser }
from "@/server/actions/auth/getUser";

export async function getWorkspaceNotes() {
  try {
    const user =
      await getUser();

    if (!user) {
      return [];
    }

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }

    const supabase =
      await createClient();

    // Collect company IDs for this workspace to scope company-attached notes
    const { data: companies } =
      await supabase
        .from("workspace_companies")
        .select("id")
        .eq("workspace_id", workspace.id);

    const companyIds =
      (companies || []).map(
        (c: { id: string }) => c.id
      );

    // Filter: notes by this user AND (no company OR company belongs to this workspace)
    let query = supabase
      .from("workspace_notes")
      .select("*")
      .eq("user_id", user.id);

    if (companyIds.length > 0) {
      query = query.or(
        `company_id.is.null,company_id.in.(${companyIds.join(",")})`
      );
    } else {
      query = query.is("company_id", null);
    }

    const { data, error } =
      await query.order(
        "created_at",
        { ascending: false }
      );

    if (error) {
      console.error("getWorkspaceNotes error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getWorkspaceNotes failed:", error);
    return [];
  }
}
