"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

const MS_PER_DAY = 86_400_000;

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

function computeDealHealth(
  probability: number | null,
  daysSinceUpdated: number,
  daysUntilClose: number | null,
  stage: string
): { healthScore: number; healthLabel: "Healthy" | "Warning" | "At Risk" } {
  const stageWeight = STAGE_WEIGHTS[stage.toLowerCase()] ?? 1.0;
  const base = probability != null ? probability : stageWeight * 50;
  const staleFactor = Math.max(0, 1 - daysSinceUpdated / 30);

  let urgencyFactor = 1.0;
  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) urgencyFactor = 0.5;
    else if (daysUntilClose === 0) urgencyFactor = 1.5;
    else if (daysUntilClose <= 7) urgencyFactor = 1.3;
    else if (daysUntilClose <= 14) urgencyFactor = 1.15;
  }

  const raw = base * staleFactor * urgencyFactor;
  const healthScore = Math.max(0, Math.min(100, Math.round(raw)));
  const healthLabel: "Healthy" | "Warning" | "At Risk" =
    healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Warning" : "At Risk";

  return { healthScore, healthLabel };
}

export type AIDeal = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  probability: number | null;
  company: string | null;
  contactName: string | null;
  expectedCloseDate: string | null;
  daysUntilClose: number | null;
  daysPastDue: number | null;
  daysSinceUpdated: number;
  isStale: boolean;
  healthScore: number;
  healthLabel: "Healthy" | "Warning" | "At Risk";
};

type RawDealRow = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  probability: number | null;
  updated_at: string;
  expected_close_date: string | null;
  company: { name: string } | null;
  contact: { name: string } | null;
};

export async function getAIDeals(): Promise<AIDeal[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workspace_deals")
      .select(
        "id, title, stage, value, probability, updated_at, expected_close_date, company:workspace_companies(name), contact:workspace_contacts(name)"
      )
      .eq("workspace_id", workspace.id)
      .neq("stage", "won")
      .neq("stage", "lost")
      .order("updated_at", { ascending: true });

    if (error || !data) return [];

    const now = Date.now();

    return ((data as unknown as RawDealRow[])).map((d) => {
      const updatedMs = new Date(d.updated_at).getTime();
      const daysSinceUpdated = Math.floor((now - updatedMs) / MS_PER_DAY);
      const closeMs = d.expected_close_date
        ? new Date(d.expected_close_date).getTime()
        : null;
      const rawDiff = closeMs !== null ? Math.ceil((closeMs - now) / MS_PER_DAY) : null;
      const daysUntilClose = rawDiff !== null && rawDiff >= 0 ? rawDiff : null;
      const daysPastDue = rawDiff !== null && rawDiff < 0 ? Math.abs(rawDiff) : null;

      const { healthScore, healthLabel } = computeDealHealth(
        d.probability != null ? Number(d.probability) : null,
        daysSinceUpdated,
        rawDiff,
        d.stage
      );

      return {
        id: d.id,
        title: d.title,
        stage: d.stage,
        value: d.value != null ? Number(d.value) : null,
        probability: d.probability != null ? Number(d.probability) : null,
        company: d.company?.name ?? null,
        contactName: d.contact?.name ?? null,
        expectedCloseDate: d.expected_close_date ?? null,
        daysUntilClose,
        daysPastDue,
        daysSinceUpdated,
        isStale: daysSinceUpdated > 7,
        healthScore,
        healthLabel,
      };
    });
  } catch {
    return [];
  }
}
