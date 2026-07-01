"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type AutomationActionEntry = {
  action: string;
  status: "success" | "failed";
  detail?: string;
};

export type AutomationHistoryItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  deal_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  metadata: {
    automation_id: string;
    trigger: string;
    actions: AutomationActionEntry[];
    status: "success" | "partial" | "failed";
  };
};

const FALLBACK: AutomationHistoryItem[] = [];

export async function getAutomationHistory(
  limit = 30
): Promise<AutomationHistoryItem[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return FALLBACK;

    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .select("id, title, description, created_at, deal_id, contact_id, company_id, metadata")
      .eq("workspace_id", workspace.id)
      .eq("type", "automation_execution")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return FALLBACK;

    return data as AutomationHistoryItem[];
  } catch {
    return FALLBACK;
  }
}

export async function getAutomationStats(): Promise<{
  total: number;
  successful: number;
  failed: number;
}> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return { total: 0, successful: 0, failed: 0 };

    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .select("metadata")
      .eq("workspace_id", workspace.id)
      .eq("type", "automation_execution");

    if (error || !data) return { total: 0, successful: 0, failed: 0 };

    const total = data.length;
    const successful = data.filter(
      (r) => (r.metadata as { status?: string })?.status === "success"
    ).length;
    const failed = data.filter(
      (r) => (r.metadata as { status?: string })?.status === "failed"
    ).length;

    return { total, successful, failed };
  } catch {
    return { total: 0, successful: 0, failed: 0 };
  }
}
