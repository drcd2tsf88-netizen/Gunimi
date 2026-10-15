import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { extractPromises } from "./extractPromises";

// Hidden marker stored in task description to prevent duplicate processing
const MARKER_PREFIX = "<!-- pid:";
const MARKER_SUFFIX = " -->";
const LOOKBACK_MINUTES = 30;

function marker(providerMessageId: string): string {
  return `${MARKER_PREFIX}${providerMessageId}${MARKER_SUFFIX}`;
}

function dueDateFromDays(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().split("T")[0];
}

export async function processEmailPromises(
  workspaceId: string,
  userId: string,
  connectionId: string,
): Promise<{ tasksCreated: number }> {
  const since = new Date(Date.now() - LOOKBACK_MINUTES * 60 * 1000).toISOString();

  const { data: messages } = await supabaseAdmin
    .from("email_messages")
    .select("provider_message_id, subject, snippet, thread_id")
    .eq("connection_id", connectionId)
    .eq("is_outbound", true)
    .gte("updated_at", since)
    .not("snippet", "is", null);

  if (!messages || messages.length === 0) return { tasksCreated: 0 };

  let tasksCreated = 0;

  for (const msg of messages) {
    if (!msg.snippet) continue;

    const msgMarker = marker(msg.provider_message_id);

    // Skip if already processed — check for our hidden marker in existing tasks
    const { count } = await supabaseAdmin
      .from("workspace_tasks")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .ilike("description", `%${msgMarker}%`);

    if ((count ?? 0) > 0) continue;

    // Resolve contact from thread CRM link
    const { data: thread } = await supabaseAdmin
      .from("email_threads")
      .select("contact_id")
      .eq("id", msg.thread_id)
      .maybeSingle();

    const contactId = thread?.contact_id ?? null;

    let promises;
    try {
      promises = await extractPromises(
        workspaceId,
        userId,
        msg.subject ?? "",
        msg.snippet,
      );
    } catch (err) {
      logger.error(`[Promises] AI extraction failed`, {
        messageId: msg.provider_message_id,
        error: err instanceof Error ? err.message : "Unknown",
      });
      continue;
    }

    for (const p of promises) {
      const dueDate = p.daysUntilDeadline !== null
        ? dueDateFromDays(p.daysUntilDeadline)
        : null;

      const { error } = await supabaseAdmin
        .from("workspace_tasks")
        .insert({
          workspace_id: workspaceId,
          user_id: userId,
          contact_id: contactId,
          title: p.text,
          description: msgMarker,
          priority: "medium",
          status: "todo",
          due_date: dueDate,
        });

      if (!error) tasksCreated++;
    }
  }

  return { tasksCreated };
}
