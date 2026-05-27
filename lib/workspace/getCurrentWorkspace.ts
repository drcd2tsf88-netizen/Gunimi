"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

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
    // AUTH USER

    const user =
      await getUser();

    if (!user) {
      console.error(
        "No authenticated user"
      );

      return null;
    }

    // GET MEMBERSHIP + WORKSPACE

    const {
      data: membership,
      error,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select(`
          workspace_id,

          workspaces (
            id,
            name,
            slug
          )
        `)
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

    // SAFETY CHECK

if (
  !membership?.workspaces
) {
  console.error(
    "No workspace found"
  );

  return null;
}

// CAST WORKSPACE

const workspace =
  membership.workspaces as unknown as Workspace;

// RETURN

return workspace;
  } catch (error) {
    console.error(
      error
    );

    return null;
  }
}
