const MS_PER_DAY = 86_400_000;

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

export type DealHealthTier = "healthy" | "warning" | "at_risk";

export type DealHealthScore = {
  score: number;
  tier: DealHealthTier;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  barClass: string;
  label: string;
};

export function computeDealHealth(
  probability: number | undefined,
  updatedAt: string | undefined,
  expectedCloseDate: string | undefined,
  stage: string
): DealHealthScore {
  const now = Date.now();

  const daysSinceUpdated = updatedAt
    ? Math.floor((now - new Date(updatedAt).getTime()) / MS_PER_DAY)
    : 30;

  const daysUntilClose = expectedCloseDate
    ? Math.floor((new Date(expectedCloseDate).getTime() - now) / MS_PER_DAY)
    : null;

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

  const score = Math.max(0, Math.min(100, Math.round(base * staleFactor * urgencyFactor)));

  if (score >= 70) {
    return {
      score,
      tier: "healthy",
      label: "Healthy",
      dotClass: "bg-emerald-400",
      textClass: "text-emerald-300",
      badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      barClass: "bg-emerald-400",
    };
  }
  if (score >= 40) {
    return {
      score,
      tier: "warning",
      label: "Warning",
      dotClass: "bg-amber-400",
      textClass: "text-amber-300",
      badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      barClass: "bg-amber-400",
    };
  }
  return {
    score,
    tier: "at_risk",
    label: "At Risk",
    dotClass: "bg-red-400",
    textClass: "text-red-300",
    badgeClass: "border-red-500/20 bg-red-500/10 text-red-300",
    barClass: "bg-red-400",
  };
}
