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
      .from("workspace_contacts")
      .select(
        "id, name, email, phone, position, company_name, status, notes, created_at"
      )
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true });

    if (error) return new Response("Failed to fetch contacts", { status: 500 });

    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "position",
      "company_name",
      "status",
      "notes",
      "created_at",
    ];

    const csv = generateCSV(headers, (data ?? []) as Record<string, unknown>[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="contacts.csv"',
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
