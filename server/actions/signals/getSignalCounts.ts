"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export type SignalCounts = {
  total: number;
  critical: number;
};

export async function getSignalCounts(): Promise<SignalCounts> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { total: 0, critical: 0 };

  const now = new Date().toISOString();

  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("severity")
    .eq("workspace_id", workspace.id)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  const rows = (data ?? []) as { severity: string }[];
  return {
    total:    rows.length,
    critical: rows.filter((r) => r.severity === "critical").length,
  };
}
