import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { TodayCalmContext } from "./types";

export async function buildCalmContext(workspaceId: string): Promise<TodayCalmContext> {
  const [contactsResult, dealsResult, companiesResult] = await Promise.all([
    supabaseAdmin
      .from("workspace_people")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    supabaseAdmin
      .from("workspace_deals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .not("stage", "in", '("won","lost")'),
    supabaseAdmin
      .from("workspace_companies")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
  ]);

  const contactCount = contactsResult.count ?? 0;
  const dealCount = dealsResult.count ?? 0;
  const companyCount = companiesResult.count ?? 0;

  // "new_workspace" only when the workspace is truly empty across all entity types
  const kind: TodayCalmContext["kind"] =
    contactCount === 0 && dealCount === 0 && companyCount === 0
      ? "new_workspace"
      : "healthy";

  return { kind, contactCount, dealCount };
}
