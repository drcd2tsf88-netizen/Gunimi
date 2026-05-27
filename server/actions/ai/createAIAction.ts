"use server";

import { createClient }
from "@/lib/supabase/server";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

type CreateAIActionProps = {
  title: string;

  description?: string;

  action_label?: string;

  action_route?: string;

  priority?: string;
};

export async function createAIAction({
  title,

  description,

  action_label,

  action_route,

  priority = "medium",
  
}
: CreateAIActionProps) {
  try {
    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return null;
    }
const supabase = await createClient();
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_ai_actions"
        )
        .insert([
          {
            workspace_id:
              workspace.id,

            title,

            description,

            action_label,

            action_route,

            priority,
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
    console.error(error);

    return null;
  }
}