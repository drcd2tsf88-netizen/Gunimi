import OpenAI from "openai";
import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { buildChatSystemPrompt } from "@/lib/ai/context/formatWorkspacePrompt";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logAIUsage } from "@/lib/ai/logUsage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const AGENT_ROLES: Record<string, string> = {
  "Task Agent": "You specialize in task management, execution tracking, and productivity workflows.",
  "Deals Agent": "You specialize in deal pipeline intelligence, revenue forecasting, and sales opportunity analysis.",
  "CRM Agent": "You specialize in contact relationships, company accounts, lead nurturing, and CRM intelligence.",
  "Calendar Agent": "You specialize in meetings, scheduling, calendar events, and time management.",
  "Email Agent": "You specialize in email threads, inbox management, and communication intelligence.",
  "Analytics Agent": "You specialize in workspace analytics, performance metrics, growth insights, and business reporting.",
  "Gunimi AI": "You are the general Gunimi workspace intelligence — capable of answering any question about the workspace.",
};

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { success } = await ratelimit.limit(user.id);
  if (!success) return errorResponse("Rate limit exceeded", 429);

  try {
    type HistoryMessage = { role: "user" | "assistant"; content: string };
    const body = await req.json() as { message?: string; agent?: string; history?: HistoryMessage[] };
    const message: string = body.message ?? "";
    const agentName: string = body.agent ?? "Gunimi AI";
    const history: HistoryMessage[] = (body.history ?? []).slice(-10);

    if (!message.trim()) return errorResponse("Message required", 400);

    const [ctx, workspace] = await Promise.all([
      getWorkspaceContext(),
      getCurrentWorkspace(),
    ]);

    const systemPrompt = ctx
      ? `You are ${agentName}, the intelligent workspace assistant for ${ctx.workspaceName} powered by Gunimi AI.
${AGENT_ROLES[agentName] ?? ""}

${buildChatSystemPrompt(ctx)}

Give a focused, actionable response. Be concise.`
      : `You are ${agentName}, powered by Gunimi AI. ${AGENT_ROLES[agentName] ?? ""} Give a focused, actionable response.`;

    // Start actions call concurrently — completes while prose streams
    const actionsPromise = openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Suggest 0-3 short follow-up actions or prompts for the user. Return JSON: { "actions": ["action 1", "action 2"] }`,
        },
        { role: "user", content: message.slice(0, 500) },
      ],
    });

    // Start prose stream immediately
    const proseStream = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.slice(0, 2000),
        })),
        { role: "user", content: message.slice(0, 4000) },
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of proseStream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ t: token })}\n\n`)
              );
            }
          }

          // Await actions (usually already resolved by now)
          const actionsResult = await actionsPromise;
          const actionsContent = actionsResult.choices[0]?.message?.content ?? "{}";
          let parsedActions: string[] = [];
          try {
            parsedActions =
              (JSON.parse(actionsContent) as { actions?: string[] }).actions ?? [];
          } catch {
            parsedActions = [];
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ a: parsedActions })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } finally {
          controller.close();
          void logAIUsage({
            workspaceId: workspace?.id ?? null,
            userId: user.id,
            feature: "assistant",
            inputTokens: 0,
            outputTokens: 0,
          });
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("orbit-assistant error:", error);
    return errorResponse("AI request failed");
  }
}
