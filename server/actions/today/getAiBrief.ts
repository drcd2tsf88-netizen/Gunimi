"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

const LANG_NAMES: Record<string, string> = { sk: "Slovak", cs: "Czech", en: "English" };

export type AiBrief = {
  text: string;
  generatedAt: string;
};

export async function getAiBrief(): Promise<AiBrief | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const { data: ws } = await supabaseAdmin
      .from("workspaces")
      .select("preferences, feature_flags")
      .eq("id", workspace.id)
      .maybeSingle();

    const flags = (ws?.feature_flags as Record<string, boolean>) ?? {};
    if (flags.ai_brief === false) return null;

    const prefs = (ws?.preferences as Record<string, unknown>) ?? {};
    const today = new Date().toISOString().split("T")[0]!;
    const cached = prefs.aiBrief as { date?: string; text?: string } | undefined;

    if (cached?.date === today && cached.text) {
      return { text: cached.text, generatedAt: today };
    }

    const lang = (prefs.language as string) ?? "en";
    const language = LANG_NAMES[lang] ?? "English";

    const [contactsRes, dealsRes, tasksRes, signalsRes] = await Promise.all([
      supabaseAdmin
        .from("workspace_people")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_deals")
        .select("id, stage, value")
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_tasks")
        .select("id, status")
        .eq("workspace_id", workspace.id),
      supabaseAdmin
        .from("workspace_signals")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .is("resolved_at", null),
    ]);

    const contactCount = contactsRes.count ?? 0;
    const deals = dealsRes.data ?? [];
    const tasks = tasksRes.data ?? [];
    const activeSignalCount = signalsRes.count ?? 0;

    const openDeals = deals.filter(
      (d) => d.stage !== "won" && d.stage !== "lost"
    ).length;
    const wonDeals = deals.filter((d) => d.stage === "won");
    const wonValue = wonDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);
    const pendingTasks = tasks.filter((t) => t.status !== "done").length;

    const contextLines = [
      `Date: ${today}`,
      `Workspace contacts: ${contactCount}`,
      `Total deals: ${deals.length} (${openDeals} open${wonDeals.length > 0 ? `, ${wonDeals.length} won worth €${wonValue.toLocaleString()}` : ""})`,
      `Pending tasks: ${pendingTasks} of ${tasks.length}`,
      `Active signals requiring attention: ${activeSignalCount}`,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: `You are an AI embedded in Gunimi, a business workspace OS. Write a daily briefing in exactly 2-3 sentences. Summarize the workspace state, highlight what needs attention today, and if relevant mention a positive data point. Be specific with numbers. Tone: professional, direct, forward-looking. Start directly with the briefing — no preamble or greeting. IMPORTANT: Write in ${language}. Do not use any other language.`,
        },
        {
          role: "user",
          content: contextLines.join("\n"),
        },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return null;

    await supabaseAdmin
      .from("workspaces")
      .update({
        preferences: { ...(prefs as object), aiBrief: { date: today, text } },
      })
      .eq("id", workspace.id);

    return { text, generatedAt: today };
  } catch (err) {
    logger.error("getAiBrief failed:", err);
    return null;
  }
}
