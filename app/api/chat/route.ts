import OpenAI from "openai";
import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { buildChatSystemPrompt } from "@/lib/ai/context/formatWorkspacePrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FALLBACK_SYSTEM =
  "You are Orbit AI, an intelligent business workspace assistant. Answer concisely and helpfully.";

export async function POST(req: Request) {
  const user = await getUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    return errorResponse("Rate limit exceeded", 429);
  }

  try {
    const body = await req.json();

    const message = body.message;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return errorResponse("Message required", 400);
    }

    const ctx = await getWorkspaceContext();
    const systemPrompt = ctx ? buildChatSystemPrompt(ctx) : FALLBACK_SYSTEM;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message.slice(0, 4000),
          },
        ],
      });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return errorResponse("AI request failed");
  }
}
