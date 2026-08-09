"use server";

import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function extractTasksFromNote(noteId: string, noteContent: string): Promise<number> {
  try {
    const user = await getUser();
    if (!user) return 0;
    if (!await checkWriteRateLimit()) return 0;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return 0;

    const plainText = stripHtml(noteContent);
    if (!plainText.trim()) return 0;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a task extraction assistant. Extract clear, actionable tasks from the provided note text. " +
            "Return a JSON array of task title strings only. Titles should be concise (max 80 chars). " +
            "Return at most 10 tasks. If there are no actionable tasks, return an empty array [].",
        },
        {
          role: "user",
          content: `Extract actionable tasks from this note:\n\n${plainText.slice(0, 3000)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let titles: string[] = [];

    try {
      const parsed = JSON.parse(raw) as { tasks?: unknown[] };
      if (Array.isArray(parsed.tasks)) {
        titles = parsed.tasks
          .map((t) => (typeof t === "string" ? t.trim() : typeof t === "object" && t !== null && "title" in t ? String((t as { title: string }).title) : ""))
          .filter((t) => t.length > 0)
          .slice(0, 10);
      } else {
        const anyArray = Object.values(parsed).find(Array.isArray);
        if (anyArray) {
          titles = (anyArray as unknown[])
            .map((t) => (typeof t === "string" ? t.trim() : ""))
            .filter((t) => t.length > 0)
            .slice(0, 10);
        }
      }
    } catch {
      return 0;
    }

    if (titles.length === 0) return 0;

    const inserts = titles.map((title) => ({
      workspace_id: workspace.id,
      user_id: user.id,
      title,
      status: "todo",
      priority: "medium",
      note_id: noteId,
    }));

    const { error } = await supabaseAdmin.from("workspace_tasks").insert(inserts);
    if (error) {
      logger.error("extractTasksFromNote insert error:", error);
      return 0;
    }

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/notes");

    return titles.length;
  } catch (err) {
    logger.error("extractTasksFromNote failed:", err);
    return 0;
  }
}
