"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

const LANG_NAMES: Record<string, string> = {
  sk: "Slovak",
  cs: "Czech",
  en: "English",
};

export async function getAiEmailDraft(opts: {
  contactId?: string;
  threadSubject?: string;
  recipientEmail: string;
  intent?: string;
}): Promise<string | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    // Workspace language
    const { data: ws } = await supabaseAdmin
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();
    const lang = (ws?.preferences as { language?: string } | null)?.language ?? "en";
    const language = LANG_NAMES[lang] ?? "English";

    const contextLines: string[] = [];

    if (opts.threadSubject) {
      contextLines.push(`Replying to thread: "${opts.threadSubject}"`);
    }
    if (opts.intent) {
      contextLines.push(`User's intent: ${opts.intent}`);
    }
    contextLines.push(`Recipient email: ${opts.recipientEmail}`);

    if (opts.contactId) {
      // Fetch contact context
      const { data: contact } = await supabaseAdmin
        .from("workspace_people")
        .select("first_name, last_name, position, last_contacted_at")
        .eq("id", opts.contactId)
        .maybeSingle();

      if (contact) {
        const name = [contact.first_name, contact.last_name].filter(Boolean).join(" ");
        contextLines.push(`Contact: ${name}${contact.position ? `, ${contact.position}` : ""}`);
        if (contact.last_contacted_at) {
          const daysAgo = Math.floor(
            (Date.now() - new Date(contact.last_contacted_at).getTime()) / 86_400_000
          );
          contextLines.push(`Last contacted: ${daysAgo} days ago`);
        }
      }

      // Open tasks
      const { data: tasks } = await supabaseAdmin
        .from("workspace_tasks")
        .select("title")
        .eq("contact_id", opts.contactId)
        .neq("status", "done")
        .limit(3);
      if (tasks && tasks.length > 0) {
        contextLines.push(`Open tasks: ${tasks.map((t: { title: string }) => t.title).join(", ")}`);
      }

      // Active deals
      const { data: deals } = await supabaseAdmin
        .from("workspace_deals")
        .select("title, stage")
        .eq("contact_id", opts.contactId)
        .limit(3);
      if (deals && deals.length > 0) {
        contextLines.push(
          `Deals: ${deals.map((d: { title: string; stage: string | null }) => `${d.title} [${d.stage ?? "—"}]`).join(", ")}`
        );
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are an AI email assistant embedded in Gunimi, a business workspace OS.
Write a concise, professional email body (no subject line, no greeting header — just the body text starting with the greeting).
Use context provided to make the email specific and relevant.
Be direct, warm, and professional. Keep it under 150 words.
Write in ${language}. Do not add placeholder brackets like [Name] — use actual data if available.`,
        },
        {
          role: "user",
          content: contextLines.join("\n"),
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    logger.error("getAiEmailDraft failed:", err);
    return null;
  }
}
