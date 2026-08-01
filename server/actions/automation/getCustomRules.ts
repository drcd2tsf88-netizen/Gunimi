"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { CustomAutomationRule } from "@/lib/automation/types";

export async function getCustomRules(): Promise<CustomAutomationRule[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("workspace_automation_rules")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as CustomAutomationRule[];
}
