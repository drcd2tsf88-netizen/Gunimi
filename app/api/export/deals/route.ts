import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { generateCSV } from "@/lib/csv/generator";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new Response("Workspace not found", { status: 404 });

    const { data, error } = await supabaseAdmin
      .from("workspace_deals")
      .select(
        `id, title, value, stage, probability, description, expected_close_date, created_at,
         company:workspace_companies(name),
         contact:workspace_contacts(name)`
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) return new Response("Failed to fetch deals", { status: 500 });

    const headers = [
      "id",
      "title",
      "value",
      "stage",
      "probability",
      "description",
      "expected_close_date",
      "company_name",
      "contact_name",
      "created_at",
    ];

    const rows = (data ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      value: d.value,
      stage: d.stage,
      probability: d.probability,
      description: d.description,
      expected_close_date: d.expected_close_date,
      company_name: (d.company as { name?: string } | null)?.name ?? "",
      contact_name: (d.contact as { name?: string } | null)?.name ?? "",
      created_at: d.created_at,
    }));

    const csv = generateCSV(headers, rows as Record<string, unknown>[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="deals.csv"',
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
