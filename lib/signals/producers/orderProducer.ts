// Signal Producer — Order Resolver
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Evaluates order signal conditions against current order state.
// Three signal types:
//   order_overdue     — due_date has passed, order not completed/cancelled
//   order_draft_stale — order sits in "draft" for more than 7 days
//   order_not_acknowledged — order sent but not acknowledged for 3+ days

import { produceSignal } from "@/lib/signals/engine";
import { resolveSignalIfExists, type SignalProductionStats } from "./_resolveByType";

const DRAFT_STALE_DAYS = 7;
const NOT_ACKNOWLEDGED_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type OrderProducerInput = {
  workspaceId: string;
  orderId: string;
  status: string;
  communicationState: string;
  dueDate: string | null;
  updatedAt: string | null;
  createdAt: string;
};

export async function produceOrderSignals(
  input: OrderProducerInput,
): Promise<SignalProductionStats> {
  const { workspaceId, orderId, status, communicationState, dueDate, updatedAt, createdAt } = input;

  // Terminal orders never have active signals.
  if (status === "completed" || status === "cancelled") {
    return { signalsProduced: 0, signalsResolved: 0 };
  }

  const now = Date.now();
  const origin = `order_resolver:${orderId}`;
  let signalsProduced = 0;
  let signalsResolved = 0;

  // ─── order_overdue ────────────────────────────────────────────────────────

  if (dueDate) {
    const msUntilDue = new Date(dueDate).getTime() - now;
    const isOverdue = msUntilDue < 0;
    const daysOverdue = Math.abs(Math.floor(msUntilDue / MS_PER_DAY));

    if (isOverdue) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "order",
          entityId: orderId,
          type: "order_overdue",
          confidence: "high",
          evidenceData: { days: daysOverdue },
          producedBy: "order_resolver",
          origin,
        })
      ) signalsProduced++;
    } else {
      signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_overdue", "due_date_not_passed");
    }
  } else {
    signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_overdue", "no_due_date");
  }

  // ─── order_draft_stale ────────────────────────────────────────────────────

  if (status === "draft") {
    const referenceDate = updatedAt ?? createdAt;
    const daysSinceActivity = Math.floor((now - new Date(referenceDate).getTime()) / MS_PER_DAY);

    if (daysSinceActivity >= DRAFT_STALE_DAYS) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "order",
          entityId: orderId,
          type: "order_draft_stale",
          confidence: "medium",
          evidenceData: { days: daysSinceActivity },
          producedBy: "order_resolver",
          origin,
        })
      ) signalsProduced++;
    } else {
      signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_draft_stale", "draft_active");
    }
  } else {
    signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_draft_stale", "status_changed");
  }

  // ─── order_not_acknowledged ───────────────────────────────────────────────

  if (communicationState === "sent") {
    const referenceDate = updatedAt ?? createdAt;
    const daysSinceSent = Math.floor((now - new Date(referenceDate).getTime()) / MS_PER_DAY);

    if (daysSinceSent >= NOT_ACKNOWLEDGED_DAYS) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "order",
          entityId: orderId,
          type: "order_not_acknowledged",
          confidence: "high",
          evidenceData: { days: daysSinceSent },
          producedBy: "order_resolver",
          origin,
        })
      ) signalsProduced++;
    } else {
      signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_not_acknowledged", "too_soon");
    }
  } else {
    signalsResolved += await resolveSignalIfExists(workspaceId, orderId, "order_not_acknowledged", "comm_state_changed");
  }

  return { signalsProduced, signalsResolved };
}
