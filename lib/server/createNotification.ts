import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { sendTaskAssigned } from "@/lib/email/sendTaskAssigned";

type CreateNotificationParams = {
  workspaceId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  href?: string;
  workspaceName?: string;
};

export async function createNotification({
  workspaceId,
  userId,
  type,
  title,
  body,
  href,
  workspaceName,
}: CreateNotificationParams): Promise<void> {
  const { error } = await supabaseAdmin
    .from("workspace_notifications")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      type,
      title,
      body: body ?? null,
      href: href ?? null,
    });

  if (error) {
    logger.error("createNotification failed:", error);
    return;
  }

  if (type === "task_assigned") {
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      logger.error(`[notification] getUserById failed for user ${userId}:`, userError);
      return;
    }

    const email = userData?.user?.email;

    if (!email) {
      logger.warn(`[notification] task_assigned skipped — no email for user ${userId}`);
      return;
    }

    const wsName = workspaceName ?? "your workspace";
    await sendTaskAssigned({ email, taskTitle: title, workspaceName: wsName, href }).catch(
      (err) => logger.error("sendTaskAssigned email failed:", err)
    );
  }
}
