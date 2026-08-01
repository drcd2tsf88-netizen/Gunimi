import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function priorityLabel(p: string): string {
  return { high: "High", medium: "Medium", low: "Low" }[p] ?? p;
}

function statusLabel(s: string): string {
  return { todo: "To Do", in_progress: "In Progress", done: "Done" }[s] ?? s;
}

function statusColor(s: string): string {
  return { todo: "#6D5BFF", in_progress: "#F59E0B", done: "#10B981" }[s] ?? "#9AA3B2";
}

function priorityColor(p: string): string {
  return { high: "#EF4444", medium: "#F59E0B", low: "#6B7280" }[p] ?? "#9AA3B2";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "no_workspace" }, { status: 400 });

  const supabase = await createClient();

  const [taskResult, commentsResult, subtasksResult, membersResult] =
    await Promise.all([
      supabase
        .from("workspace_tasks")
        .select("id, title, description, status, priority, due_date, assigned_to, created_at, updated_at, contact_id, parent_task_id")
        .eq("id", id)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),

      supabase
        .from("task_comments")
        .select("id, user_id, content, created_at")
        .eq("task_id", id)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("workspace_tasks")
        .select("id, title, status, priority, created_at")
        .eq("parent_task_id", id)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("workspace_members")
        .select("user_id, profiles(full_name)")
        .eq("workspace_id", workspace.id),
    ]);

  if (!taskResult.data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const task = taskResult.data;

  type ProfileJoin = { full_name: string | null };
  type MemberRow = { user_id: string; profiles: ProfileJoin | ProfileJoin[] | null };

  const memberMap = new Map<string, string>();
  for (const m of (membersResult.data ?? []) as MemberRow[]) {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    if (profile?.full_name) memberMap.set(m.user_id, profile.full_name);
  }

  const assigneeName = task.assigned_to ? (memberMap.get(task.assigned_to) ?? "Unknown") : "Unassigned";
  const comments = commentsResult.data ?? [];
  const subtasks = subtasksResult.data ?? [];

  const exportedAt = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const commentsHtml = comments.length === 0
    ? `<p style="color:#6B7280;font-size:14px;font-style:italic;">No comments on this task.</p>`
    : comments.map((c) => `
      <div style="border:1px solid #1F2937;border-radius:10px;padding:14px 16px;margin-bottom:10px;background:#0D1117;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:13px;font-weight:600;color:#D1D5DB;">${memberMap.get(c.user_id) ?? "Unknown"}</span>
          <span style="font-size:11px;color:#4B5563;">${formatDateTime(c.created_at)}</span>
        </div>
        <p style="margin:0;font-size:14px;color:#9AA3B2;line-height:1.6;white-space:pre-wrap;">${c.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>`
    ).join("");

  const subtasksHtml = subtasks.length === 0
    ? `<p style="color:#6B7280;font-size:14px;font-style:italic;">No subtasks.</p>`
    : subtasks.map((s) => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #1F2937;">
        <span style="width:8px;height:8px;border-radius:50%;background:${statusColor(s.status)};flex-shrink:0;"></span>
        <span style="font-size:14px;color:#D1D5DB;flex:1;${s.status === "done" ? "text-decoration:line-through;color:#6B7280;" : ""}">${s.title.replace(/</g, "&lt;")}</span>
        <span style="font-size:11px;color:#4B5563;">${statusLabel(s.status)}</span>
      </div>`
    ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Task Report: ${task.title.replace(/</g, "&lt;")}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 40px;
      background: #05060A;
      color: #F7F8FC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #1F2937; }
    .logo-dot { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6D5BFF, #22D3EE); flex-shrink: 0; }
    .logo-text { font-size: 18px; font-weight: 700; color: #F7F8FC; letter-spacing: -0.02em; }
    .export-meta { margin-left: auto; font-size: 11px; color: #4B5563; text-align: right; }
    .task-title { font-size: 28px; font-weight: 700; color: #F7F8FC; letter-spacing: -0.02em; margin: 0 0 20px; line-height: 1.2; }
    .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
    .badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; padding: 20px; background: #0A0E17; border-radius: 12px; border: 1px solid #1F2937; }
    .meta-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #4B5563; margin-bottom: 4px; }
    .meta-item .value { font-size: 14px; color: #D1D5DB; font-weight: 500; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #4B5563; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #1F2937; }
    .description-box { background: #0A0E17; border: 1px solid #1F2937; border-radius: 12px; padding: 16px 20px; font-size: 14px; color: #9AA3B2; line-height: 1.7; white-space: pre-wrap; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #1F2937; font-size: 11px; color: #374151; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 24px; background: #ffffff; color: #111827; }
      .header { border-color: #E5E7EB; }
      .meta-grid { background: #F9FAFB; border-color: #E5E7EB; }
      .description-box { background: #F9FAFB; border-color: #E5E7EB; color: #374151; }
      .section-title { color: #9CA3AF; border-color: #E5E7EB; }
      .footer { border-color: #E5E7EB; color: #9CA3AF; }
      .task-title { color: #111827; }
      .logo-text { color: #111827; }
      .meta-item .value { color: #374151; }
      .export-meta { color: #9CA3AF; }
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <div class="logo-dot"></div>
      <span class="logo-text">Gunimi</span>
      <div class="export-meta">
        Task Report<br />
        Exported: ${exportedAt}<br />
        Workspace: ${workspace.name}
      </div>
    </div>

    <h1 class="task-title">${task.title.replace(/</g, "&lt;")}</h1>

    <div class="badges">
      <span class="badge" style="color:${statusColor(task.status)};border-color:${statusColor(task.status)}33;background:${statusColor(task.status)}15;">
        ${statusLabel(task.status)}
      </span>
      <span class="badge" style="color:${priorityColor(task.priority)};border-color:${priorityColor(task.priority)}33;background:${priorityColor(task.priority)}15;">
        ${priorityLabel(task.priority)} Priority
      </span>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="label">Assigned to</div>
        <div class="value">${assigneeName}</div>
      </div>
      <div class="meta-item">
        <div class="label">Due date</div>
        <div class="value">${formatDate(task.due_date)}</div>
      </div>
      <div class="meta-item">
        <div class="label">Created</div>
        <div class="value">${formatDateTime(task.created_at)}</div>
      </div>
      <div class="meta-item">
        <div class="label">Last updated</div>
        <div class="value">${formatDateTime(task.updated_at)}</div>
      </div>
      <div class="meta-item">
        <div class="label">Comments</div>
        <div class="value">${comments.length}</div>
      </div>
      <div class="meta-item">
        <div class="label">Subtasks</div>
        <div class="value">${subtasks.length} (${subtasks.filter((s) => s.status === "done").length} done)</div>
      </div>
    </div>

    ${task.description ? `
    <div class="section">
      <div class="section-title">Description</div>
      <div class="description-box">${task.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>` : ""}

    ${subtasks.length > 0 ? `
    <div class="section">
      <div class="section-title">Subtasks (${subtasks.length})</div>
      ${subtasksHtml}
    </div>` : ""}

    <div class="section">
      <div class="section-title">Comments (${comments.length})</div>
      ${commentsHtml}
    </div>

    <div class="footer">
      <span>Gunimi — AI Workspace OS &mdash; gunimi.com</span>
      <span>Task ID: ${task.id}</span>
    </div>

  </div>
  <script>
    // Auto-open print dialog when opened directly
    if (window.location.search.includes('print=1')) {
      window.addEventListener('load', () => window.print());
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="task-report-${id.slice(0, 8)}.html"`,
    },
  });
}
