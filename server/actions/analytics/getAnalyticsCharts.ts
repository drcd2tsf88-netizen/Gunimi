"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

export type DealsByStage = {
  stage: string;
  count: number;
  value: number;
};

export type MonthlyDeals = {
  month: string;
  label: string;
  count: number;
};

export type WonVsLost = {
  won: number;
  lost: number;
  wonValue: number;
};

export type AnalyticsCharts = {
  dealsByStage: DealsByStage[];
  monthlyDeals: MonthlyDeals[];
  wonVsLost: WonVsLost;
};

const STAGE_ORDER = ["lead", "qualified", "proposal", "negotiation", "won"];

const FALLBACK: AnalyticsCharts = {
  dealsByStage: [],
  monthlyDeals: [],
  wonVsLost: { won: 0, lost: 0, wonValue: 0 },
};

export async function getAnalyticsCharts(): Promise<AnalyticsCharts> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const supabase = await createClient();

    const { data: deals, error } = await supabase
      .from("workspace_deals")
      .select("stage, value, created_at")
      .eq("workspace_id", workspace.id);

    if (error || !deals) return FALLBACK;

    // 1. Deals by stage (pipeline + won)
    const stageMap = new Map<string, { count: number; value: number }>();
    STAGE_ORDER.forEach((s) => stageMap.set(s, { count: 0, value: 0 }));

    deals.forEach((d) => {
      if (!d.stage || d.stage === "lost") return;
      const entry = stageMap.get(d.stage) ?? { count: 0, value: 0 };
      stageMap.set(d.stage, {
        count: entry.count + 1,
        value: entry.value + (d.value ?? 0),
      });
    });

    const dealsByStage: DealsByStage[] = STAGE_ORDER.map((stage) => {
      const entry = stageMap.get(stage) ?? { count: 0, value: 0 };
      return { stage, count: entry.count, value: entry.value };
    });

    // 2. Monthly deal creation — last 6 months
    const now = new Date();
    const months: { year: number; month: number; label: string; key: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({ year: d.getFullYear(), month: d.getMonth(), label, key });
    }

    const monthlyMap = new Map<string, number>();
    months.forEach((m) => monthlyMap.set(m.key, 0));

    deals.forEach((d) => {
      if (!d.created_at) return;
      const date = new Date(d.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
      }
    });

    const monthlyDeals: MonthlyDeals[] = months.map((m) => ({
      month: m.key,
      label: m.label,
      count: monthlyMap.get(m.key) ?? 0,
    }));

    // 3. Won vs Lost
    const won = deals.filter((d) => d.stage === "won");
    const lost = deals.filter((d) => d.stage === "lost");
    const wonVsLost: WonVsLost = {
      won: won.length,
      lost: lost.length,
      wonValue: won.reduce((sum, d) => sum + (d.value ?? 0), 0),
    };

    return { dealsByStage, monthlyDeals, wonVsLost };
  } catch (error) {
    logger.error("getAnalyticsCharts failed:", error);
    return FALLBACK;
  }
}
