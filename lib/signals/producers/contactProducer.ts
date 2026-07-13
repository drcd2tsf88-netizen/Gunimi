// Signal Producer — Contact Resolver
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Evaluates all contact signal conditions against the current contact state.
// Fetches contact tasks from DB to evaluate per-task overdue signals (contact_overdue_task).

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceSignal } from "@/lib/signals/engine";
import {
  resolveSignalIfExists,
  type SignalProductionStats,
} from "./_resolveByType";
import { MS_PER_DAY } from "@/lib/workspace/constants";
import { STALE_RELATIONSHIP_DAYS, NEW_RELATIONSHIP_DAYS } from "@/lib/contacts/constants";

export type ContactProducerInput = {
  workspaceId: string;
  contactId: string;
  lastContactedAt: string | null;
  createdAt: string;
  email: string | null;
  phone: string | null;
  companyId: string | null;
};

export async function produceContactSignals(
  input: ContactProducerInput,
): Promise<SignalProductionStats> {
  const { workspaceId, contactId, lastContactedAt, createdAt, email, phone, companyId } = input;

  const now = Date.now();
  const origin = `contact_resolver:${contactId}`;
  let signalsProduced = 0;
  let signalsResolved = 0;

  // ─── contact_stale ────────────────────────────────────────────────────────

  const daysSinceContact = lastContactedAt
    ? Math.floor((now - new Date(lastContactedAt).getTime()) / MS_PER_DAY)
    : null;

  if (daysSinceContact !== null && daysSinceContact > STALE_RELATIONSHIP_DAYS) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "contact",
        entityId: contactId,
        type: "contact_stale",
        confidence: "high",
        evidenceData: { days: daysSinceContact },
        producedBy: "contact_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      contactId,
      "contact_stale",
      "contact_interaction",
    );
  }

  // ─── contact_new_no_interaction ───────────────────────────────────────────

  const daysSinceCreated = Math.floor((now - new Date(createdAt).getTime()) / MS_PER_DAY);

  if (!lastContactedAt && daysSinceCreated <= NEW_RELATIONSHIP_DAYS) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "contact",
        entityId: contactId,
        type: "contact_new_no_interaction",
        confidence: "high",
        evidenceData: { days: daysSinceCreated },
        producedBy: "contact_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      contactId,
      "contact_new_no_interaction",
      "first_interaction",
    );
  }

  // ─── contact_no_company ───────────────────────────────────────────────────

  if (!companyId) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "contact",
        entityId: contactId,
        type: "contact_no_company",
        confidence: "high",
        evidenceData: {},
        producedBy: "contact_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      contactId,
      "contact_no_company",
      "company_linked",
    );
  }

  // ─── contact_no_reach ─────────────────────────────────────────────────────

  if (!email && !phone) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "contact",
        entityId: contactId,
        type: "contact_no_reach",
        confidence: "high",
        evidenceData: {},
        producedBy: "contact_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      contactId,
      "contact_no_reach",
      "contact_info_added",
    );
  }

  // ─── contact_overdue_task (taskLevelDedup — one signal per task) ──────────

  const todayStr = new Date().toISOString().split("T")[0];

  const { data: tasks } = await supabaseAdmin
    .from("workspace_tasks")
    .select("id, status, due_date")
    .eq("workspace_id", workspaceId)
    .eq("contact_id", contactId);

  if (tasks) {
    for (const task of tasks as { id: string; status: string; due_date: string | null }[]) {
      const taskOrigin = `task_engine:${task.id}`;
      const dueDateStr = task.due_date?.split("T")[0];
      const isOverdue =
        task.status !== "done" && dueDateStr !== undefined && dueDateStr < todayStr;

      if (task.status === "done") {
        signalsResolved += await resolveSignalIfExists(
          workspaceId,
          contactId,
          "contact_overdue_task",
          "task_completed",
          taskOrigin,
        );
      } else if (isOverdue && task.due_date) {
        const daysOverdue = Math.floor(
          (now - new Date(task.due_date).getTime()) / MS_PER_DAY,
        );
        if (
          await produceSignal({
            workspaceId,
            entityType: "contact",
            entityId: contactId,
            type: "contact_overdue_task",
            confidence: "high",
            evidenceData: { days: daysOverdue },
            producedBy: "contact_resolver",
            origin: taskOrigin,
          })
        ) signalsProduced++;
      }
    }
  }

  return { signalsProduced, signalsResolved };
}
