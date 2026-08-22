"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { createNotification } from "@/lib/server/createNotification";

export async function createTaskComment(
  taskId: string,
  content: string
): Promise<{ success: boolean; id?: string }> {
  try {
    const user = await getUser();
    if (!user) return { success: false };
    if (!await checkWriteRateLimit()) return { success: false };

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false };

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 4000) return { success: false };

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("task_comments")
      .insert({
        workspace_id: workspace.id,
        task_id: taskId,
        user_id: user.id,
        content: trimmed,
      })
      .select("id")
      .single();

    if (error) {
      logger.error("createTaskComment failed", error);
      return { success: false };
    }

    // Notify task assignee about the new comment (if not the commenter)
    const { data: task } = await supabaseAdmin
      .from("workspace_tasks")
      .select("assigned_to, title")
      .eq("id", taskId)
      .maybeSingle();

    if (task?.assigned_to && task.assigned_to !== user.id) {
      // Resolve commenter display name from auth metadata
      const { data: commenterData } = await supabaseAdmin.auth.admin.getUserById(user.id);
      const commenterName =
        (commenterData?.user?.user_metadata?.full_name as string | undefined) ??
        commenterData?.user?.email?.split("@")[0] ??
        "Someone";

      await createNotification({
        workspaceId: workspace.id,
        userId: task.assigned_to,
        type: "task_comment",
        title: task.title ?? taskId,
        href: `/dashboard/tasks?task=${taskId}`,
        workspaceName: workspace.name,
        senderName: commenterName,
      }).catch((err) => logger.error("task_comment notification failed", err));
    }

    return { success: true, id: data.id };
  } catch (err) {
    logger.error("createTaskComment unexpected error", err);
    return { success: false };
  }
}
