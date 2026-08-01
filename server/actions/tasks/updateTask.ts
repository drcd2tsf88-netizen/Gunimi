"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { produceTaskSignals } from "@/lib/signals/producers/taskProducer";
import { createTask } from "@/server/actions/tasks/createTask";
import { createNotification } from "@/lib/server/createNotification";

type UpdateTaskParams = {
  id: string;
  title?: string;
  description?: string | null;
  priority?: string;
  status?: string;
  due_date?: string | null;
  assigned_to?: string | null;
  is_recurring?: boolean;
  recurrence_frequency?: string | null;
  recurrence_interval?: number | null;
};

function calculateNextDueDate(
  currentDueDate: string | null,
  frequency: string,
  interval: number
): string | null {
  const base = currentDueDate ? new Date(currentDueDate) : new Date();

  switch (frequency) {
    case "daily":
      base.setDate(base.getDate() + interval);
      break;
    case "weekly":
      base.setDate(base.getDate() + interval * 7);
      break;
    case "monthly":
      base.setMonth(base.getMonth() + interval);
      break;
    case "yearly":
      base.setFullYear(base.getFullYear() + interval);
      break;
    default:
      return null;
  }

  return base.toISOString().split("T")[0];
}

export async function updateTask({
  id,
  ...fields
}: UpdateTaskParams): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    type RecurringSnapshot = {
      is_recurring: boolean;
      recurrence_frequency: string | null;
      recurrence_interval: number | null;
      due_date: string | null;
      title: string;
      description: string | null;
      priority: string;
      assigned_to: string | null;
    };

    let recurringSnapshot: RecurringSnapshot | null = null;

    const needsTaskFetch =
      fields.status === "done" ||
      fields.assigned_to !== undefined ||
      (!!fields.assigned_to && fields.title === undefined);

    let fetchedTaskTitle: string | null = null;
    let previousAssignedTo: string | null = null;

    if (needsTaskFetch) {
      const { data } = await supabase
        .from("workspace_tasks")
        .select(
          "is_recurring, recurrence_frequency, recurrence_interval, due_date, title, description, priority, assigned_to"
        )
        .eq("id", id)
        .eq("workspace_id", workspace.id)
        .maybeSingle();

      if (fields.status === "done") {
        recurringSnapshot = data as RecurringSnapshot | null;
      }
      fetchedTaskTitle = (data as { title?: string } | null)?.title ?? null;
      previousAssignedTo = (data as { assigned_to?: string | null } | null)?.assigned_to ?? null;
    }

    const { error } = await supabase
      .from("workspace_tasks")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("workspace_id", workspace.id);

    if (error) {
      logger.error(error);
      return false;
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "task_updated",
        title: "Task Updated",
        description: fields.title
          ? `Updated task "${fields.title}"`
          : "Updated a task",
      });

    await produceTaskSignals({ workspaceId: workspace.id, taskId: id });

    const assigneeChanged = fields.assigned_to !== previousAssignedTo;
    if (fields.assigned_to && fields.assigned_to !== user.id && assigneeChanged) {
      const notifTitle = fields.title ?? fetchedTaskTitle ?? id;
      await createNotification({
        workspaceId: workspace.id,
        userId: fields.assigned_to,
        type: "task_assigned",
        title: notifTitle,
        href: "/dashboard/tasks",
        workspaceName: workspace.name,
      });
    }

    if (
      recurringSnapshot?.is_recurring &&
      recurringSnapshot.recurrence_frequency
    ) {
      const nextDueDate = calculateNextDueDate(
        recurringSnapshot.due_date,
        recurringSnapshot.recurrence_frequency,
        recurringSnapshot.recurrence_interval ?? 1
      );

      await createTask({
        title: recurringSnapshot.title,
        description: recurringSnapshot.description ?? undefined,
        priority: recurringSnapshot.priority,
        status: "todo",
        due_date: nextDueDate,
        assigned_to: recurringSnapshot.assigned_to,
        is_recurring: true,
        recurrence_frequency: recurringSnapshot.recurrence_frequency,
        recurrence_interval: recurringSnapshot.recurrence_interval ?? 1,
      });
    }

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}
