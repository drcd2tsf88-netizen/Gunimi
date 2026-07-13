"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type ScanTypeState = {
  lastRunAt: string | null;
  lastFailedAt: string | null;
  lastError: string | null;
};

export type WorkspacePreferences = {
  language?: string;
  aiLanguage?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  numberFormat?: "dot" | "comma";
  firstDayOfWeek?: "monday" | "sunday";
  /** Internal: scan schedule state per scan type. Not user-facing. */
  scanSchedule?: Record<string, ScanTypeState>;
};

export type WorkspaceSettings = {
  id: string;
  name: string;
  slug: string;
  preferences?: WorkspacePreferences | null;
};

export async function getWorkspaceSettings(): Promise<WorkspaceSettings | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspaces")
      .select("id, name, slug, preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as WorkspaceSettings;
  } catch {
    return null;
  }
}
