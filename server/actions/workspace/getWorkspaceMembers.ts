"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

export async function getWorkspaceMembers() {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return [];
    }
const supabase =  await createClient();
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select(`
          id,
          role,
          users (
            id,
            email,
            avatar_url
          )
        `)
        .eq(
          "workspace_id",
          workspace.id
        );

    if (error) {
      console.error(
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);

    return [];
  }
}