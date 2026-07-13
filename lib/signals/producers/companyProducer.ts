// Signal Producer — Company Resolver
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Evaluates company signal conditions against the current company state.
// Fetches related contacts and deals from DB to evaluate cross-entity conditions.
// company_closing_deal is NOT managed here — the deal resolver owns that signal.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceSignal } from "@/lib/signals/engine";
import {
  resolveSignalIfExists,
  type SignalProductionStats,
} from "./_resolveByType";
import { MS_PER_DAY, STALE_COMPANY_DAYS } from "@/lib/companies/constants";

export type CompanyProducerInput = {
  workspaceId: string;
  companyId: string;
  lastActivityAt: string | null;
  industry: string | null;
};

export async function produceCompanySignals(
  input: CompanyProducerInput,
): Promise<SignalProductionStats> {
  const { workspaceId, companyId, lastActivityAt, industry } = input;

  const now = Date.now();
  const origin = `company_resolver:${companyId}`;
  let signalsProduced = 0;
  let signalsResolved = 0;

  const [contactsResult, dealsResult] = await Promise.all([
    supabaseAdmin
      .from("workspace_contacts")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("company_id", companyId),
    supabaseAdmin
      .from("workspace_deals")
      .select("id, stage")
      .eq("workspace_id", workspaceId)
      .eq("company_id", companyId),
  ]);

  const contacts = (contactsResult.data ?? []) as { id: string }[];
  const deals = (dealsResult.data ?? []) as { id: string; stage: string }[];
  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");

  // ─── company_stale ────────────────────────────────────────────────────────

  const daysSinceActivity = lastActivityAt
    ? Math.floor((now - new Date(lastActivityAt).getTime()) / MS_PER_DAY)
    : null;

  if (daysSinceActivity === null || daysSinceActivity > STALE_COMPANY_DAYS) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "company",
        entityId: companyId,
        type: "company_stale",
        confidence: "high",
        evidenceData: daysSinceActivity !== null ? { days: daysSinceActivity } : {},
        producedBy: "company_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      companyId,
      "company_stale",
      "company_activity",
    );
  }

  // ─── company_no_contacts ──────────────────────────────────────────────────

  if (contacts.length === 0) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "company",
        entityId: companyId,
        type: "company_no_contacts",
        confidence: "high",
        evidenceData: {},
        producedBy: "company_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      companyId,
      "company_no_contacts",
      "contact_added",
    );
  }

  // ─── company_no_active_deals ──────────────────────────────────────────────

  if (openDeals.length === 0) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "company",
        entityId: companyId,
        type: "company_no_active_deals",
        confidence: "high",
        evidenceData: {},
        producedBy: "company_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      companyId,
      "company_no_active_deals",
      "deal_opened",
    );
  }

  // ─── company_incomplete_profile ───────────────────────────────────────────

  if (!industry) {
    if (
      await produceSignal({
        workspaceId,
        entityType: "company",
        entityId: companyId,
        type: "company_incomplete_profile",
        confidence: "high",
        evidenceData: {},
        producedBy: "company_resolver",
        origin,
      })
    ) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      companyId,
      "company_incomplete_profile",
      "profile_completed",
    );
  }

  return { signalsProduced, signalsResolved };
}
