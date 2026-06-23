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
      .from("workspace_tasks")
      .select(
        "id, title, description, status, priority, due_date, created_at"
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false });

    if (error) return new Response("Failed to fetch tasks", { status: 500 });

    const headers = [
      "id",
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "created_at",
    ];

    const csv = generateCSV(headers, (data ?? []) as Record<string, unknown>[]);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="tasks.csv"',
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
