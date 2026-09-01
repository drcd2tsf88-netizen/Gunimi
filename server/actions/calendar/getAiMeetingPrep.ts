"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import { queryEntityBusinessMemories } from "@/lib/memory/businessMemoryQueries";

export type MeetingPrep = {
  contextSummary: string;
  suggestedTopics: string[];
  keyPoints: string[];
};

export async function getAiMeetingPrep(
  eventTitle: string,
  contactId: string
): Promise<MeetingPrep | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const [contactResult, dealsResult, tasksResult, memoriesResult] = await Promise.all([
      supabaseAdmin
        .from("workspace_people")
        .select("first_name, last_name, position, last_contacted_at")
        .eq("id", contactId)
        .eq("workspace_id", workspace.id)
        .maybeSingle(),
      supabaseAdmin
        .from("workspace_deals")
        .select("title, stage")
        .eq("contact_id", contactId)
        .eq("workspace_id", workspace.id)
        .not("stage", "in", '("closed_won","closed_lost")')
        .limit(3),
      supabaseAdmin
        .from("workspace_tasks")
        .select("title, priority")
        .eq("contact_id", contactId)
        .eq("workspace_id", workspace.id)
        .neq("status", "done")
        .limit(3),
      queryEntityBusinessMemories(workspace.id, contactId, "contact", 4),
    ]);

    const contact = contactResult.data;
    if (!contact) return null;

    const contactName = [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "Contact";
    const deals = dealsResult.data ?? [];
    const tasks = tasksResult.data ?? [];
    const memories = memoriesResult ?? [];

    const lastContact = contact.last_contacted_at
      ? `${Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / 86_400_000)} days ago`
      : "Unknown";

    const prompt = [
      `Meeting: "${eventTitle}"`,
      `Contact: ${contactName}${contact.position ? `, ${contact.position}` : ""}`,
      `Last contact: ${lastContact}`,
      deals.length > 0
        ? `Active deals: ${deals.map((d: { title: string; stage: string | null }) => `${d.title} [${d.stage ?? "—"}]`).join(", ")}`
        : "No active deals",
      tasks.length > 0
        ? `Open tasks: ${tasks.map((t: { title: string; priority: string | null }) => t.title).join(", ")}`
        : "No open tasks",
      memories.length > 0
        ? `Stored context:\n${memories.map((m) => `- [${m.memory_type}] ${m.content}`).join("\n")}`
        : null,
    ].filter(Boolean).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a CRM meeting intelligence layer embedded in Gunimi.
Given context about an upcoming meeting, generate a concise prep brief.
Return JSON with exactly these fields:
- contextSummary: string (1-2 sentences summarizing the relationship status)
- suggestedTopics: string[] (3 specific discussion topics based on deals/tasks)
- keyPoints: string[] (2-3 key things to keep in mind for this meeting)
Be specific, actionable, and brief. No filler phrases.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as MeetingPrep;
    return parsed;
  } catch (err) {
    logger.error("getAiMeetingPrep failed:", err);
    return null;
  }
}
