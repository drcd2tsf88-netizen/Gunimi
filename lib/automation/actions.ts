import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { AutomationActionResult, AutomationContext } from "./types";
import { logger } from "@/lib/logger";

export async function automationCreateTask(
  context: AutomationContext,
  title: string,
  priority: "low" | "medium" | "high" = "medium"
): Promise<AutomationActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("workspace_tasks")
      .insert({
        workspace_id: context.workspaceId,
        user_id: context.userId,
        assigned_to: context.userId,
        contact_id: context.contactId ?? null,
        title,
        status: "todo",
        priority,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { action: "create_task", status: "failed", detail: error.message };
    }
    return { action: "create_task", status: "success", detail: title };
  } catch (e) {
    return { action: "create_task", status: "failed", detail: String(e) };
  }
}

export async function automationCreateNote(
  context: AutomationContext,
  title: string,
  content?: string
): Promise<AutomationActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("workspace_notes")
      .insert({
        workspace_id: context.workspaceId,
        user_id: context.userId,
        company_id: context.companyId ?? null,
        contact_id: context.contactId ?? null,
        title,
        content: content ?? null,
      });

    if (error) {
      return { action: "create_note", status: "failed", detail: error.message };
    }
    return { action: "create_note", status: "success", detail: title };
  } catch (e) {
    return { action: "create_note", status: "failed", detail: String(e) };
  }
}

export async function automationLogExecution(
  context: AutomationContext,
  automationId: string,
  automationName: string,
  trigger: string,
  results: AutomationActionResult[]
): Promise<void> {
  const successCount = results.filter((r) => r.status === "success").length;
  const overallStatus =
    results.length === 0
      ? "success"
      : successCount === results.length
        ? "success"
        : successCount === 0
          ? "failed"
          : "partial";

  const description =
    results
      .filter((r) => r.detail)
      .map((r) => r.detail)
      .join("; ") || automationName;

  try {
    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: context.workspaceId,
      user_id: context.userId,
      deal_id: context.dealId ?? null,
      contact_id: context.contactId ?? null,
      company_id: context.companyId ?? null,
      type: "automation_execution",
      title: automationName,
      description,
      metadata: {
        automation_id: automationId,
        trigger,
        actions: results,
        status: overallStatus,
      },
    });
  } catch (e) {
    logger.error("[automation] failed to log execution:", e);
  }
}
