"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { createAuditLog }
from "@/lib/server/audit";

type CreateTaskProps = {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string | null;
};

export async function createTask({
  title,
  description = "",
  priority = "medium",
  status = "todo",
  due_date = null,
}: CreateTaskProps) {
  try {
    const supabase =
      await createClient();

    // AUTH

    const user =
      await getUser();

    if (!user) {
      console.error(
        "Unauthorized"
      );

      return null;
    }

    // WORKSPACE

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      console.error(
        "No active workspace"
      );

      return null;
    }

    // VALIDATION

    const cleanTitle =
      title?.trim();

    if (!cleanTitle) {
      console.error(
        "Task title required"
      );

      return null;
    }

    // CREATE TASK

    const {
      data,
      error,
    } = await supabase
      .from(
        "workspace_tasks"
      )
      .insert([
        {
          title:
            cleanTitle,

          description,

          priority,

          status,

          due_date,

          user_id:
            user.id,

          workspace_id:
            workspace.id,

          updated_at:
            new Date().toISOString(),
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

    // ACTIVITY FEED

    await supabase
      .from(
        "workspace_activity"
      )
      .insert({
        workspace_id:
          workspace.id,

        user_id:
          user.id,

        type:
          "task_created",

        title:
          "Task Created",

        description:
          `Created task "${cleanTitle}"`,
      });

    // AUDIT LOG

    await createAuditLog({
      workspace_id:
        workspace.id,

      user_id:
        user.id,

      action:
        "task_created",

      entity:
        "workspace_task",

      metadata: {
        taskId:
          data.id,

        title:
          cleanTitle,

        priority,

        status,
      },
    });

    return data;
  } catch (error) {
    console.error(
      error
    );

    return null;
  }
}