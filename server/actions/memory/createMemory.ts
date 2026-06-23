"use server";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

type CreateMemoryProps = {
  type: string;

  content: string;
};

export async function createMemory({
  type,

  content,
}: CreateMemoryProps) {
  try {
    const user =
      await getUser();

    if (!user) {
      return null;
    }

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }

    const { data, error } =
      await supabaseAdmin
        .from(
          "workspace_memory"
        )
        .insert([
          {
            workspace_id:
              workspace.id,

            type,

            content,

            user_id:
              user.id,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

      return null;
    }

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}