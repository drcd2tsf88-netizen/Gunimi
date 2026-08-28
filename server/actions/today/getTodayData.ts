"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getTodaySignals } from "@/lib/signals/queries/today";
import { buildCalmContext } from "@/lib/today/calmContext";
import type { ResolvedTodayData } from "@/lib/today/types";

const EMPTY: ResolvedTodayData = {
  health: { level: "healthy", labelKey: "healthHealthy" },
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

    if (result.focus === null) {
      const calmContext = await buildCalmContext(workspace.id);
      return { ...result, calmContext };
    }

    return result;
  } catch {
    return EMPTY;
  }
}
