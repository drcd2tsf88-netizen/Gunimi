// Vercel Cron — Task Due Date Reminders
// Schedule: 0 8 * * * (every day at 08:00 UTC)
// Sends an email to each workspace member whose tasks are due today (status != done).
// Deduplicates via workspace_notifications: skips if a reminder was already sent today.

import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendTaskDueReminder } from "@/lib/email/sendTaskDueReminder";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TaskRow = {
  id: string;
  title: string;
  due_date: string;
  assigned_to: string;
  workspace_id: string;
  workspaces: { name: string } | { name: string }[] | null;
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const startOfDay = `${todayStr}T00:00:00.000Z`;

  const { data: tasks, error } = await supabaseAdmin
    .from("workspace_tasks")
    .select("id, title, due_date, assigned_to, workspace_id, workspaces(name)")
    .eq("due_date", todayStr)
    .neq("status", "done")
    .not("assigned_to", "is", null);

  if (error) {
    logger.error("[task-reminders] failed to fetch tasks", error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const task of (tasks ?? []) as TaskRow[]) {
    try {
      // Dedup: check if reminder already sent today for this task + user
      const { data: existing } = await supabaseAdmin
        .from("workspace_notifications")
        .select("id")
        .eq("user_id", task.assigned_to)
        .eq("type", "task_due_reminder")
        .eq("href", `/dashboard/tasks?task=${task.id}`)
        .gte("created_at", startOfDay)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      // Insert in-app notification (also triggers email in createNotification, but we call directly here)
      await supabaseAdmin.from("workspace_notifications").insert({
        workspace_id: task.workspace_id,
        user_id: task.assigned_to,
        type: "task_due_reminder",
        title: task.title,
        href: `/dashboard/tasks?task=${task.id}`,
      });

      // Get user email
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(task.assigned_to);
      if (userError || !userData?.user?.email) {
        logger.warn(`[task-reminders] no email for user ${task.assigned_to}`);
        skipped++;
        continue;
      }

      const wsName = Array.isArray(task.workspaces)
        ? (task.workspaces[0]?.name ?? "your workspace")
        : (task.workspaces?.name ?? "your workspace");

      await sendTaskDueReminder({
        email: userData.user.email,
        taskTitle: task.title,
        workspaceName: wsName,
        dueDate: new Date(task.due_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      sent++;
    } catch (err) {
      logger.error(`[task-reminders] failed for task ${task.id}`, err);
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    date: todayStr,
    processed: (tasks ?? []).length,
    sent,
    skipped,
    failed,
  });
}
