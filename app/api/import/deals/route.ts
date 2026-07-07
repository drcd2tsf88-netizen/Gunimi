import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import { DEAL_FIELDS, validateRow } from "@/lib/csv/schemas";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

const MAX_ROWS = 500;

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { success } = await ratelimit.limit(user.id);
    if (!success) return errorResponse("Rate limit exceeded", 429);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const body = await req.json();
    const rawRows: Record<string, string>[] = body.rows ?? [];
    const mapping: Record<string, string> = body.mapping ?? {};

    if (!rawRows.length) return errorResponse("No rows provided", 400);
    if (rawRows.length > MAX_ROWS)
      return errorResponse(`Maximum ${MAX_ROWS} rows per import`, 400);

    // Pre-fetch company name→id for automatic linking
    const { data: companies } = await supabaseAdmin
      .from("workspace_companies")
      .select("id, name")
      .eq("workspace_id", workspace.id);

    const companyMap = new Map<string, string>();
    if (companies) {
      for (const c of companies) {
        companyMap.set(c.name.toLowerCase(), c.id);
      }
    }

    const inserts: Record<string, unknown>[] = [];
    const errors: { row: number; field: string; error: string }[] = [];

    rawRows.forEach((row, idx) => {
      const { data, errors: rowErrors } = validateRow(
        row,
        mapping,
        DEAL_FIELDS
      );

      if (rowErrors.length > 0) {
        rowErrors.forEach((e) => errors.push({ row: idx + 2, ...e }));
        return;
      }

      const companyName = String(data.company_name ?? "");
      const companyId = companyName
        ? (companyMap.get(companyName.toLowerCase()) ?? null)
        : null;

      inserts.push({
        workspace_id: workspace.id,
        owner_id: user.id,
        title: data.title,
        value: data.value ?? null,
        stage: data.stage ?? "lead",
        probability: data.probability ?? null,
        description: data.description ?? null,
        expected_close_date: data.expected_close_date ?? null,
        company_id: companyId,
        updated_at: new Date().toISOString(),
      });
    });

    if (inserts.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("workspace_deals")
        .insert(inserts);

      if (insertError) return errorResponse("Import failed", 500);

      await supabaseAdmin.from("workspace_activity").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "deals_imported",
        title: "Deals Imported",
        description: `Imported ${inserts.length} ${inserts.length === 1 ? "deal" : "deals"} from CSV`,
      });
    }

    return NextResponse.json({
      success: true,
      imported: inserts.length,
      skipped: errors.length,
      errors,
    });
  } catch {
    return errorResponse("Server error", 500);
  }
}
