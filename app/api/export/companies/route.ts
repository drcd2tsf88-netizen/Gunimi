import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { generateCSV } from "@/lib/csv/generator";
import { ratelimit } from "@/lib/ratelimit";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { success } = await ratelimit.limit(user.id);
    if (!success) return new Response("Rate limit exceeded", { status: 429 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new Response("Workspace not found", { status: 404 });

    const { data, error } = await supabaseAdmin
      .from("workspace_companies")
      .select(
        "id, name, industry, website, country, phone, company_size, status, relationship_stage, created_at"
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) return new Response("Failed to fetch companies", { status: 500 });

    const headers = [
      "id",
      "name",
      "industry",
      "website",
      "country",
      "phone",
      "company_size",
      "status",
      "relationship_stage",
      "created_at",
    ];

    const csv = generateCSV(headers, (data ?? []) as Record<string, unknown>[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="companies.csv"',
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
