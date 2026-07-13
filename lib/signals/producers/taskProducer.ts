// Signal Producer — Task Engine
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Evaluates task signal conditions against the current task state (fetched from DB).
// Handles task-entity signals (task_overdue, task_due_today, task_blocked, task_waiting_customer)
// and the cross-entity contact_overdue_task signal (taskLevelDedup per task).
//
// Fetches the full task state from DB on every call so the server action only
// needs to pass workspaceId and taskId.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceSignal } from "@/lib/signals/engine";
import {
  resolveSignalIfExists,
  type SignalProductionStats,
} from "./_resolveByType";
import { MS_PER_DAY } from "@/lib/workspace/constants";

export type TaskProducerInput = {
  workspaceId: string;
  taskId: string;
};

export async function produceTaskSignals(
  input: TaskProducerInput,
): Promise<SignalProductionStats> {
  const { workspaceId, taskId } = input;

  const { data: task } = await supabaseAdmin
    .from("workspace_tasks")
    .select("status, due_date, contact_id")
    .eq("id", taskId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (!task) return { signalsProduced: 0, signalsResolved: 0 };

  const {
    status,
    due_date: dueDate,
    contact_id: contactId,
  } = task as { status: string; due_date: string | null; contact_id: string | null };

  const taskOrigin = `task_engine:${taskId}`;
  const now = Date.now();
  const todayStr = new Date().toISOString().split("T")[0];
  const dueDateStr = dueDate?.split("T")[0];

  // ─── Terminal state — task completed ──────────────────────────────────────

  if (status === "done") {
    const results = await Promise.all([
      resolveSignalIfExists(workspaceId, taskId, "task_overdue", "task_completed", taskOrigin),
      resolveSignalIfExists(workspaceId, taskId, "task_due_today", "task_completed", taskOrigin),
      resolveSignalIfExists(workspaceId, taskId, "task_blocked", "task_completed", taskOrigin),
      resolveSignalIfExists(
        workspaceId,
        taskId,
        "task_waiting_customer",
        "task_completed",
        taskOrigin,
      ),
      contactId
        ? resolveSignalIfExists(
            workspaceId,
            contactId,
            "contact_overdue_task",
            "task_completed",
            taskOrigin,
          )
        : Promise.resolve(0),
    ]);
    return {
      signalsProduced: 0,
      signalsResolved: results.reduce((a, b) => a + b, 0),
    };
  }

  let signalsProduced = 0;
  let signalsResolved = 0;

  // ─── task_overdue / task_due_today ────────────────────────────────────────

  if (!dueDateStr) {
    const results = await Promise.all([
      resolveSignalIfExists(workspaceId, taskId, "task_overdue", "due_date_removed", taskOrigin),
      resolveSignalIfExists(workspaceId, taskId, "task_due_today", "due_date_removed", taskOrigin),
      contactId
        ? resolveSignalIfExists(
            workspaceId,
            contactId,
            "contact_overdue_task",
            "due_date_removed",
            taskOrigin,
          )
        : Promise.resolve(0),
    ]);
    signalsResolved += results.reduce((a, b) => a + b, 0);
  } else if (dueDateStr < todayStr) {
    const daysOverdue = Math.floor((now - new Date(dueDate as string).getTime()) / MS_PER_DAY);

    if (
      await produceSignal({
        workspaceId,
        entityType: "task",
        entityId: taskId,
        type: "task_overdue",
        confidence: "high",
        evidenceData: { days: daysOverdue },
        producedBy: "task_engine",
        origin: taskOrigin,
      })
    ) signalsProduced++;

    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      taskId,
      "task_due_today",
      "task_became_overdue",
      taskOrigin,
    );

    if (contactId) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "contact",
          entityId: contactId,
          type: "contact_overdue_task",
          confidence: "high",
          evidenceData: { days: daysOverdue },
          producedBy: "task_engine",
          origin: taskOrigin,
        })
      ) signalsProduced++;
    }
  } else if (dueDateStr === todayStr) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "task",
        entityId: taskId,
        type: "task_due_today",
        confidence: "high",
        evidenceData: {},
        producedBy: "task_engine",
        origin: taskOrigin,
      })
    ) signalsProduced++;

    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      taskId,
      "task_overdue",
      "task_rescheduled",
      taskOrigin,
    );

    if (contactId) {
      signalsResolved += await resolveSignalIfExists(
        workspaceId,
        contactId,
        "contact_overdue_task",
        "task_rescheduled",
        taskOrigin,
      );
    }
  } else {
    const results = await Promise.all([
      resolveSignalIfExists(workspaceId, taskId, "task_overdue", "task_rescheduled", taskOrigin),
      resolveSignalIfExists(workspaceId, taskId, "task_due_today", "task_rescheduled", taskOrigin),
      contactId
        ? resolveSignalIfExists(
            workspaceId,
            contactId,
            "contact_overdue_task",
            "task_rescheduled",
            taskOrigin,
          )
        : Promise.resolve(0),
    ]);
    signalsResolved += results.reduce((a, b) => a + b, 0);
  }

  // ─── task_blocked ─────────────────────────────────────────────────────────

  if (status === "blocked") {
    if (
      await produceSignal({
        workspaceId,
        entityType: "task",
        entityId: taskId,
        type: "task_blocked",
        confidence: "high",
        evidenceData: {},
        producedBy: "task_engine",
        origin: taskOrigin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      taskId,
      "task_blocked",
      "block_resolved",
      taskOrigin,
    );
  }

  // ─── task_waiting_customer ────────────────────────────────────────────────

  if (status === "waiting_customer") {
    if (
      await produceSignal({
        workspaceId,
        entityType: "task",
        entityId: taskId,
        type: "task_waiting_customer",
        confidence: "high",
        evidenceData: {},
        producedBy: "task_engine",
        origin: taskOrigin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      taskId,
      "task_waiting_customer",
      "response_received",
      taskOrigin,
    );
  }

  return { signalsProduced, signalsResolved };
}
