import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { TodayCalmContext } from "./types";

export async function buildCalmContext(workspaceId: string): Promise<TodayCalmContext> {
  const [contactsResult, dealsResult] = await Promise.all([
    supabaseAdmin
      .from("workspace_contacts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    supabaseAdmin
      .from("workspace_deals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .not("stage", "in", '("won","lost")'),
  ]);

  const contactCount = contactsResult.count ?? 0;
  const dealCount = dealsResult.count ?? 0;

  const kind: TodayCalmContext["kind"] =
    contactCount < 3 && dealCount === 0 ? "new_workspace" : "healthy";

  return { kind, contactCount, dealCount };
}
