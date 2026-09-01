const MS_PER_DAY = 86_400_000;

export type HealthTier = "healthy" | "watching" | "at_risk" | "cold";

export type HealthScore = {
  score: number;
  tier: HealthTier;
  dotClass: string;
  textClass: string;
  tierKey: string;
};

export type HealthInput = {
  lastEmailAt: string | null;
  emailsLast30d: number;
  openTasks: number;
  totalDeals: number;
};

export function computeContactHealth(input: HealthInput): HealthScore {
  let pts = 0;
  const now = Date.now();

  // Email recency (0–40 pts)
  if (input.lastEmailAt) {
    const days = Math.floor((now - new Date(input.lastEmailAt).getTime()) / MS_PER_DAY);
    if (days <= 7)        pts += 40;
    else if (days <= 14)  pts += 32;
    else if (days <= 30)  pts += 22;
    else if (days <= 60)  pts += 12;
    else if (days <= 90)  pts += 5;
  }

  // Email frequency last 30d (0–25 pts)
  if (input.emailsLast30d >= 5)       pts += 25;
  else if (input.emailsLast30d >= 3)  pts += 18;
  else if (input.emailsLast30d >= 1)  pts += 10;

  // Deals (0–20 pts)
  if (input.totalDeals >= 2)       pts += 20;
  else if (input.totalDeals === 1) pts += 14;

  // Open tasks (0–15 pts)
  if (input.openTasks >= 2)       pts += 15;
  else if (input.openTasks === 1) pts += 10;

  const score = Math.min(100, pts);

  if (score >= 60) {
    return { score, tier: "healthy",  dotClass: "bg-emerald-400", textClass: "text-emerald-400/70", tierKey: "healthScore.healthy" };
  }
  if (score >= 30) {
    return { score, tier: "watching", dotClass: "bg-amber-400",   textClass: "text-amber-400/70",   tierKey: "healthScore.watching" };
  }
  if (score >= 10) {
    return { score, tier: "at_risk",  dotClass: "bg-red-400",     textClass: "text-red-400/70",     tierKey: "healthScore.atRisk" };
  }
  return   { score, tier: "cold",     dotClass: "bg-zinc-600",    textClass: "text-zinc-500",       tierKey: "healthScore.cold" };
}
