"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { getUser }
from "@/server/actions/auth/getUser";

type CreateWorkspaceInviteProps = {
  email: string;
};

export async function createWorkspaceInvite({
  email,
}: CreateWorkspaceInviteProps) {
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
          "workspace_invites"
        )
        .insert([
          {
            email,

            workspace_id:
              workspace.id,

            invited_by:
              user.id,

            status:
              "pending",
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(
        error
      );

      return null;
    }

    return data;
  } catch (error) {
    console.error(
      error
    );

    return null;
  }
}