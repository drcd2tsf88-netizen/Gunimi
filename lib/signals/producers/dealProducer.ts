// Signal Producer — Deal Resolver
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Evaluates all deal signal conditions against the current deal state.
// Produces signals when conditions are met; resolves existing signals when conditions clear.
// Never modifies business logic or the Decision Resolver.

import { produceSignal } from "@/lib/signals/engine";
import {
  resolveSignalIfExists,
  type SignalProductionStats,
} from "./_resolveByType";
import { MS_PER_DAY, STALE_THRESHOLD_DAYS } from "@/lib/deals/constants";
import { CLOSING_SOON_DAYS } from "@/lib/companies/constants";

export type DealProducerInput = {
  workspaceId: string;
  dealId: string;
  stage: string;
  value: number | null;
  expectedCloseDate: string | null;
  updatedAt: string | null;
  contactId: string | null;
  companyId: string | null;
  title: string;
};

export async function produceDealSignals(
  input: DealProducerInput,
): Promise<SignalProductionStats> {
  const {
    workspaceId,
    dealId,
    stage,
    value,
    expectedCloseDate,
    updatedAt,
    contactId,
    companyId,
    title,
  } = input;

  // Terminal deals never have active signals — resolution is handled by the server action.
  if (stage === "won" || stage === "lost") return { signalsProduced: 0, signalsResolved: 0 };

  const now = Date.now();
  const origin = `deal_resolver:${dealId}`;
  let signalsProduced = 0;
  let signalsResolved = 0;

  // ─── Close date signals ───────────────────────────────────────────────────

  const msUntilClose = expectedCloseDate
    ? new Date(expectedCloseDate).getTime() - now
    : null;
  const daysUntilClose = msUntilClose !== null ? Math.floor(msUntilClose / MS_PER_DAY) : null;

  const isApproachingClose =
    daysUntilClose !== null && daysUntilClose >= 0 && daysUntilClose <= CLOSING_SOON_DAYS;
  const isDatePassed = daysUntilClose !== null && daysUntilClose < 0;

  if (isApproachingClose && daysUntilClose !== null) {
    const closePlusSeven = new Date(expectedCloseDate as string);
    closePlusSeven.setDate(closePlusSeven.getDate() + CLOSING_SOON_DAYS);
    const expiresAt = closePlusSeven.toISOString();

    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_approaching_close",
        confidence: "high",
        evidenceData: { days: daysUntilClose },
        producedBy: "deal_resolver",
        origin,
        expiresAt,
      })
    ) signalsProduced++;

    if (companyId) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "company",
          entityId: companyId,
          type: "company_closing_deal",
          confidence: "high",
          evidenceData: { days: daysUntilClose, dealTitle: title },
          producedBy: "deal_resolver",
          origin,
          expiresAt,
        })
      ) signalsProduced++;
    }
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_approaching_close",
      "deal_updated",
    );
    if (companyId) {
      signalsResolved += await resolveSignalIfExists(
        workspaceId,
        companyId,
        "company_closing_deal",
        "deal_updated",
        origin,
      );
    }
  }

  if (isDatePassed && daysUntilClose !== null) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_close_date_passed",
        confidence: "high",
        evidenceData: { days: Math.abs(daysUntilClose) },
        producedBy: "deal_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_close_date_passed",
      "close_date_updated",
    );
  }

  // ─── deal_missing_close_date ──────────────────────────────────────────────

  if (!expectedCloseDate) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_missing_close_date",
        confidence: "high",
        evidenceData: {},
        producedBy: "deal_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_missing_close_date",
      "close_date_set",
    );
  }

  // ─── deal_stale ───────────────────────────────────────────────────────────

  const daysSinceUpdate = updatedAt
    ? Math.floor((now - new Date(updatedAt).getTime()) / MS_PER_DAY)
    : null;

  const isStale = daysSinceUpdate !== null && daysSinceUpdate > STALE_THRESHOLD_DAYS;

  if (isStale && daysSinceUpdate !== null) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_stale",
        confidence: "high",
        evidenceData: { days: daysSinceUpdate },
        producedBy: "deal_resolver",
        origin,
      })
    ) signalsProduced++;

    if (contactId) {
      if (
        await produceSignal({
          workspaceId,
          entityType: "contact",
          entityId: contactId,
          type: "contact_deal_stalling",
          confidence: "high",
          evidenceData: { days: daysSinceUpdate, dealTitle: title },
          producedBy: "deal_resolver",
          origin,
        })
      ) signalsProduced++;
    }
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_stale",
      "deal_updated",
    );
    if (contactId) {
      signalsResolved += await resolveSignalIfExists(
        workspaceId,
        contactId,
        "contact_deal_stalling",
        "deal_updated",
        origin,
      );
    }
  }

  // ─── deal_no_primary_contact ──────────────────────────────────────────────

  if (!contactId) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_no_primary_contact",
        confidence: "high",
        evidenceData: {},
        producedBy: "deal_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_no_primary_contact",
      "contact_linked",
    );
  }

  // ─── deal_missing_value ───────────────────────────────────────────────────

  if (!value || Number(value) === 0) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "deal",
        entityId: dealId,
        type: "deal_missing_value",
        confidence: "high",
        evidenceData: {},
        producedBy: "deal_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      dealId,
      "deal_missing_value",
      "value_set",
    );
  }

  return { signalsProduced, signalsResolved };
}
