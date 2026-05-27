"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

type CreateTaskProps = {
  title: string;

  status?: string;

  priority?: string;

  workspaceId?: string;
};

export async function createTask({
  title,

  status = "active",

  priority = "medium",
  workspaceId,
}: CreateTaskProps) {
  try {
    // AUTH USER
const supabase = await createClient();
    const user =
      await getUser();

    if (!user) {
      console.error(
        "No authenticated user"
      );

      return null;
    }

    // CURRENT WORKSPACE

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      console.error(
        "No active workspace found"
      );

      return null;
    }

    // CREATE TASK

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_tasks"
        )
        .insert([
          {
            title,

            status,

            priority,

            user_id:
              user.id,

            workspace_id:
              workspace.id,
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