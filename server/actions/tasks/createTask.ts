"use server";

import { getUser }
from "@/server/actions/auth/getUser";

import { checkWriteRateLimit }
from "@/lib/server/rateLimit";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";

import { createAuditLog }
from "@/lib/server/audit";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { produceTaskSignals } from "@/lib/signals/producers/taskProducer";
import { createNotification } from "@/lib/server/createNotification";
import { dispatchWebhookEvent } from "@/lib/webhooks/dispatch";

type CreateTaskProps = {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string | null;
  assigned_to?: string | null;
  contactId?: string | null;
  is_recurring?: boolean;
  recurrence_frequency?: string | null;
  recurrence_interval?: number | null;
};

export async function createTask({
  title,
  description = "",
  priority = "medium",
  status = "todo",
  due_date = null,
  assigned_to = null,
  contactId = null,
  is_recurring = false,
  recurrence_frequency = null,
  recurrence_interval = null,
}: CreateTaskProps) {
  try {
    // AUTH

    const user =
      await getUser();

    if (!user) {
      logger.error(
        "Unauthorized"
      );

      return null;
    }

    if (!await checkWriteRateLimit()) return null;

    // WORKSPACE

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      logger.error(
        "No active workspace"
      );

      return null;
    }

    // VALIDATION

    const cleanTitle =
      title?.trim();

    if (!cleanTitle) {
      logger.error(
        "Task title required"
      );

      return null;
    }

    // CREATE TASK — supabaseAdmin bypasses RLS; auth/workspace checks above are the security gate

    const {
      data,
      error,
    } = await supabaseAdmin
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

          assigned_to,

          contact_id:
            contactId || null,

          user_id:
            user.id,

          workspace_id:
            workspace.id,

          is_recurring,

          recurrence_frequency,

          recurrence_interval,

          updated_at:
            new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error(
        error
      );

      return null;
    }

    // ACTIVITY FEED — non-critical, isolated
    try {
      await supabaseAdmin
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
    } catch { }

    // SIGNALS — non-critical, isolated
    try {
      await produceTaskSignals({ workspaceId: workspace.id, taskId: data.id });
    } catch { }

    void dispatchWebhookEvent(workspace.id, "task.created", {
      id: data.id,
      title: cleanTitle,
      priority,
      status,
      due_date,
    });

    if (assigned_to && assigned_to !== user.id) {
      try {
        await createNotification({
          workspaceId: workspace.id,
          userId: assigned_to,
          type: "task_assigned",
          title: cleanTitle,
          href: "/dashboard/tasks",
          workspaceName: workspace.name,
        });
      } catch { }
    }

    // AUDIT LOG — non-critical, isolated
    try {
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
    } catch { }

    return data;
  } catch (error) {
    logger.error(
      error
    );

    return null;
  }
}