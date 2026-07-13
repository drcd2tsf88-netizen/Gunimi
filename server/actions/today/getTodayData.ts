"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getTodaySignals } from "@/lib/signals/queries/today";
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
    return await getTodaySignals(workspace.id);
  } catch {
    return EMPTY;
  }
}
