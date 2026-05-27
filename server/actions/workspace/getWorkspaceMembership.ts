"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceMembership() {
  try {
    const user =
      await getUser();

    if (!user) {
      return null;
    }
const supabase =
      await createClient();
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select("*")
        .eq(
          "workspace_id",
          workspace.id
        )
        .eq(
          "user_id",
          user.id
        )
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        error
      );

      return null;
    }

    return {
      workspace,

      membership: data,
    };
  } catch (error) {
    console.error(
      error
    );

    return null;
  }
}
