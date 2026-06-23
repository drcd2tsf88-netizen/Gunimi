import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import { COMPANY_FIELDS, validateRow } from "@/lib/csv/schemas";
import { NextResponse } from "next/server";

const MAX_ROWS = 500;

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const body = await req.json();
    const rawRows: Record<string, string>[] = body.rows ?? [];
    const mapping: Record<string, string> = body.mapping ?? {};

    if (!rawRows.length) return errorResponse("No rows provided", 400);
    if (rawRows.length > MAX_ROWS)
      return errorResponse(`Maximum ${MAX_ROWS} rows per import`, 400);

    const inserts: Record<string, unknown>[] = [];
    const errors: { row: number; field: string; error: string }[] = [];

    rawRows.forEach((row, idx) => {
      const { data, errors: rowErrors } = validateRow(
        row,
        mapping,
        COMPANY_FIELDS
      );

      if (rowErrors.length > 0) {
        rowErrors.forEach((e) => errors.push({ row: idx + 2, ...e }));
        return;
      }

      inserts.push({
        workspace_id: workspace.id,
        user_id: user.id,
        owner_id: user.id,
        name: data.name,
        industry: data.industry ?? null,
        website: data.website ?? null,
        country: data.country ?? null,
        phone: data.phone ?? null,
        company_size: data.company_size ?? null,
        status: data.status ?? "lead",
        relationship_stage: data.relationship_stage ?? "lead",
        updated_at: new Date().toISOString(),
      });
    });

    if (inserts.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("workspace_companies")
        .insert(inserts);

      if (insertError) return errorResponse("Import failed", 500);

      await supabaseAdmin.from("workspace_activity").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "companies_imported",
        title: "Companies Imported",
        description: `Imported ${inserts.length} ${inserts.length === 1 ? "company" : "companies"} from CSV`,
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
