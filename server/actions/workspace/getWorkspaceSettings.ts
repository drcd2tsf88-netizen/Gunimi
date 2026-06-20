"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type WorkspacePreferences = {
  language?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
};

export type WorkspaceSettings = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  preferences: WorkspacePreferences | null;
};

export async function getWorkspaceSettings(): Promise<WorkspaceSettings | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspaces")
      .select("id, name, slug, description, preferences")
      .eq("id", workspace.id)
      .single();

    if (error) {
      // Fallback to minimal data if extended columns don't exist
      return { ...workspace, description: null, preferences: null };
    }

    return data as WorkspaceSettings;
  } catch {
    return null;
  }
}
