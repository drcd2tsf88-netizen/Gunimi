"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceState =
  | "awakening"   // No business data — workspace uninitiated
  | "active"      // Has data, operating normally
  | "learning"    // Reserved: AI has accumulated signals and is forming patterns
  | "autonomous"; // Reserved: Workspace generates proactive recommendations unprompted

export async function getWorkspaceState(): Promise<WorkspaceState> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return "awakening";

    const client = await createClient();

    const [companies, contacts, deals] = await Promise.all([
      client
        .from("companies")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      client
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      client
        .from("deals")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);

    const hasData =
      (companies.count ?? 0) > 0 ||
      (contacts.count ?? 0) > 0 ||
      (deals.count ?? 0) > 0;

    return hasData ? "active" : "awakening";
  } catch {
    // Fail open — show Today rather than permanently block the dashboard.
    return "active";
  }
}
