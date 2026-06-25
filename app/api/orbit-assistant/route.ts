import OpenAI from "openai";
import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { buildChatSystemPrompt } from "@/lib/ai/context/formatWorkspacePrompt";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logAIUsage } from "@/lib/ai/logUsage";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const AGENT_ROLES: Record<string, string> = {
  "Task Agent": "You specialize in task management, execution tracking, and productivity workflows.",
  "CRM Agent": "You specialize in CRM intelligence, deal pipelines, contact relationships, and sales workflows.",
  "Orbit Core": "You are the general workspace operating system intelligence.",
};

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { success } = await ratelimit.limit(user.id);
  if (!success) return errorResponse("Rate limit exceeded", 429);

  try {
    const body = await req.json();
    const message: string = body.message ?? "";
    const agentName: string = body.agent ?? "Orbit Core";

    if (!message.trim()) return errorResponse("Message required", 400);

    const [ctx, workspace] = await Promise.all([
      getWorkspaceContext(),
      getCurrentWorkspace(),
    ]);

    const systemPrompt = ctx
      ? `You are ${agentName} within Orbit AI, the intelligent assistant for ${ctx.workspaceName}.
${AGENT_ROLES[agentName] ?? ""}

${buildChatSystemPrompt(ctx)}

Return a JSON object:
{
  "response": "your answer here",
  "actions": ["suggested next step 1", "suggested next step 2"]
}

Keep "response" focused and actionable. Keep "actions" to 0-3 short strings only.`
      : `You are ${agentName} within Orbit AI. ${AGENT_ROLES[agentName] ?? ""}
Respond with JSON: { "response": "...", "actions": [] }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.slice(0, 4000) },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as { response?: string; actions?: string[] };

    void logAIUsage({
      workspaceId: workspace?.id ?? null,
      userId: user.id,
      feature: "assistant",
      inputTokens: completion.usage?.prompt_tokens ?? 0,
      outputTokens: completion.usage?.completion_tokens ?? 0,
    });

    return NextResponse.json({
      response: parsed.response ?? "Orbit AI could not generate a response.",
      actions: parsed.actions ?? [],
    });
  } catch (error) {
    console.error("orbit-assistant error:", error);
    return errorResponse("AI request failed");
  }
}
