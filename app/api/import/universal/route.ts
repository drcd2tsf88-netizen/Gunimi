import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import {
  COMPANY_FIELDS,
  CONTACT_FIELDS,
  DEAL_FIELDS,
  TASK_FIELDS,
  EntityType,
  validateRow,
} from "@/lib/csv/schemas";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";
import { generateContactFirstLook } from "@/server/actions/crm/generateContactFirstLook";

const MAX_TOTAL_ROWS = 2000;

type BatchInput = {
  entityType: EntityType;
  rows: Record<string, string>[];
  mapping: Record<string, string>;
};

type BatchResult = {
  entityType: EntityType;
  imported: number;
  skipped: number;
};

const ENTITY_ORDER: EntityType[] = ["companies", "contacts", "deals", "tasks"];

const FIELDS_MAP: Record<EntityType, typeof COMPANY_FIELDS> = {
  companies: COMPANY_FIELDS,
  contacts: CONTACT_FIELDS,
  deals: DEAL_FIELDS,
  tasks: TASK_FIELDS,
};

// Insert companies that don't exist yet; add confirmed IDs to companyMap.
// Never pre-populates companyMap before a confirmed DB insert.
async function ensureCompanies(
  names: string[],
  companyMap: Map<string, string>,
  workspaceId: string,
  userId: string
): Promise<void> {
  const missing = [...new Set(names.filter((n) => n && !companyMap.has(n.toLowerCase())))];
  if (missing.length === 0) return;

  const inserts = missing.map((name) => ({
    workspace_id: workspaceId,
    user_id: userId,
    owner_id: userId,
    name,
    status: "lead",
    relationship_stage: "lead",
    updated_at: new Date().toISOString(),
  }));

  const { data: inserted } = await supabaseAdmin
    .from("workspace_companies")
    .insert(inserts)
    .select("id, name");

  for (const c of inserted ?? []) {
    companyMap.set(c.name.toLowerCase(), c.id);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { success } = await ratelimit.limit(user.id);
    if (!success) return errorResponse("Rate limit exceeded", 429);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const body = await req.json();
    const batches: BatchInput[] = body.batches ?? [];

    if (!batches.length) return errorResponse("No batches provided", 400);

    const totalRows = batches.reduce((sum, b) => sum + b.rows.length, 0);
    if (totalRows > MAX_TOTAL_ROWS) {
      return errorResponse(`Maximum ${MAX_TOTAL_ROWS} rows total`, 400);
    }

    // Sort by entity order: companies first
    const sorted = [...batches].sort(
      (a, b) => ENTITY_ORDER.indexOf(a.entityType) - ENTITY_ORDER.indexOf(b.entityType)
    );

    // Pre-fetch existing companies for dedup + linking
    const { data: existing } = await supabaseAdmin
      .from("workspace_companies")
      .select("id, name")
      .eq("workspace_id", workspace.id);

    const companyMap = new Map<string, string>();
    for (const c of existing ?? []) {
      companyMap.set(c.name.toLowerCase(), c.id);
    }

    const results: BatchResult[] = [];

    for (const batch of sorted) {
      const fields = FIELDS_MAP[batch.entityType];
      let imported = 0;
      let skipped = 0;

      // Validate all rows upfront
      const validData: Record<string, unknown>[] = [];
      for (const row of batch.rows) {
        const { data, errors } = validateRow(row, batch.mapping, fields);
        if (errors.length > 0) {
          skipped++;
        } else {
          validData.push(data);
        }
      }

      if (batch.entityType === "companies") {
        const toInsert: Record<string, unknown>[] = [];

        for (const data of validData) {
          const name = String(data.name ?? "").trim();
          if (!name) { skipped++; continue; }
          if (companyMap.has(name.toLowerCase())) {
            // Already exists — dedup
            skipped++;
            continue;
          }
          // Mark as pending so duplicates within the same batch don't double-insert
          companyMap.set(name.toLowerCase(), "__pending__");
          toInsert.push({
            workspace_id: workspace.id,
            user_id: user.id,
            owner_id: user.id,
            name,
            industry: data.industry ?? null,
            website: data.website ?? null,
            country: data.country ?? null,
            phone: data.phone ?? null,
            company_size: data.company_size ?? null,
            status: data.status ?? "lead",
            relationship_stage: data.relationship_stage ?? "lead",
            updated_at: new Date().toISOString(),
          });
        }

        if (toInsert.length > 0) {
          const { data: inserted, error } = await supabaseAdmin
            .from("workspace_companies")
            .insert(toInsert)
            .select("id, name");

          if (!error && inserted) {
            imported = inserted.length;
            // Replace __pending__ placeholders with actual IDs
            for (const c of inserted) {
              companyMap.set(c.name.toLowerCase(), c.id);
            }
          } else {
            // Insert failed — remove pending placeholders so contacts don't get bad IDs
            for (const row of toInsert) {
              const key = String(row.name ?? "").toLowerCase();
              if (companyMap.get(key) === "__pending__") {
                companyMap.delete(key);
              }
            }
            skipped += toInsert.length;
          }
        }

      } else if (batch.entityType === "contacts") {
        const companyNames = validData
          .map((d) => String(d.company_name ?? "").trim())
          .filter(Boolean);
        await ensureCompanies(companyNames, companyMap, workspace.id, user.id);

        const toInsert = validData.map((data) => {
          const cName = String(data.company_name ?? "").trim();
          const cId = cName ? (companyMap.get(cName.toLowerCase()) ?? null) : null;
          return {
            workspace_id: workspace.id,
            user_id: user.id,
            assigned_to: user.id,
            name: data.name,
            email: data.email ?? null,
            phone: data.phone ?? null,
            position: data.position ?? null,
            company_name: cName || null,
            // Only set company_id if it's a real UUID, not a failed placeholder
            company_id: cId && cId !== "__pending__" ? cId : null,
            status: data.status ?? "lead",
            notes: data.notes ?? null,
            updated_at: new Date().toISOString(),
          };
        });

        if (toInsert.length > 0) {
          const { data: inserted, error } = await supabaseAdmin
            .from("workspace_people")
            .insert(toInsert)
            .select("id");
          if (!error && inserted) {
            imported = inserted.length;
            // Fire AI first look for each imported contact (non-blocking)
            for (let i = 0; i < inserted.length; i++) {
              const d = validData[i];
              void generateContactFirstLook({
                workspaceId: workspace.id,
                contactId: inserted[i].id,
                name: String(d.name ?? ""),
                email: d.email ? String(d.email) : null,
                companyName: d.company_name ? String(d.company_name) : null,
                position: d.position ? String(d.position) : null,
              });
            }
          } else {
            skipped += toInsert.length;
          }
        }

      } else if (batch.entityType === "deals") {
        const companyNames = validData
          .map((d) => String(d.company_name ?? "").trim())
          .filter(Boolean);
        await ensureCompanies(companyNames, companyMap, workspace.id, user.id);

        const toInsert = validData.map((data) => {
          const cName = String(data.company_name ?? "").trim();
          const cId = cName ? (companyMap.get(cName.toLowerCase()) ?? null) : null;
          return {
            workspace_id: workspace.id,
            owner_id: user.id,
            title: data.title,
            value: data.value ?? null,
            stage: data.stage ?? "lead",
            probability: data.probability ?? null,
            description: data.description ?? null,
            expected_close_date: data.expected_close_date ?? null,
            company_id: cId && cId !== "__pending__" ? cId : null,
            updated_at: new Date().toISOString(),
          };
        });

        if (toInsert.length > 0) {
          const { data: inserted, error } = await supabaseAdmin
            .from("workspace_deals")
            .insert(toInsert)
            .select("id");
          if (!error && inserted) imported = inserted.length;
          else skipped += toInsert.length;
        }

      } else if (batch.entityType === "tasks") {
        const toInsert = validData.map((data) => ({
          workspace_id: workspace.id,
          user_id: user.id,
          title: data.title,
          due_date: data.due_date ?? null,
          priority: data.priority ?? "medium",
          status: data.status ?? "todo",
          description: data.description ?? null,
          updated_at: new Date().toISOString(),
        }));

        if (toInsert.length > 0) {
          const { data: inserted, error } = await supabaseAdmin
            .from("workspace_tasks")
            .insert(toInsert)
            .select("id");
          if (!error && inserted) imported = inserted.length;
          else skipped += toInsert.length;
        }
      }

      results.push({ entityType: batch.entityType, imported, skipped });
    }

    const totalImported = results.reduce((sum, r) => sum + r.imported, 0);
    if (totalImported > 0) {
      await supabaseAdmin.from("workspace_activity").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        type: "universal_import",
        title: "Universal Import",
        description: `Imported ${totalImported} records from CSV`,
      });
    }

    return NextResponse.json({
      success: true,
      results,
      total: {
        imported: totalImported,
        skipped: results.reduce((sum, r) => sum + r.skipped, 0),
      },
    });
  } catch {
    return errorResponse("Server error", 500);
  }
}
