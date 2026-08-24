"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getTodaySignals } from "@/lib/signals/queries/today";
import { buildCalmContext } from "@/lib/today/calmContext";
import type { ResolvedTodayData } from "@/lib/today/types";

const EMPTY: ResolvedTodayData = {
  health: { level: "healthy", labelKey: "today.healthHealthy" },
  focus: null,
  attention: [],
  relationships: [],
  work: [],
};

export async function getTodayData(): Promise<ResolvedTodayData> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const result = await getTodaySignals(workspace.id);

    const isCalm =
      result.focus === null &&
      result.attention.length === 0 &&
      result.relationships.length === 0 &&
      result.work.length === 0;

    if (isCalm) {
      const calmContext = await buildCalmContext(workspace.id);
      return { ...result, calmContext };
    }

    return result;
  } catch {
    return EMPTY;
  }
}
