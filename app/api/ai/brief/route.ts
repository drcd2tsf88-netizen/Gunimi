import OpenAI from "openai";
import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { formatWorkspacePrompt } from "@/lib/ai/context/formatWorkspacePrompt";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { success } = await ratelimit.limit(user.id);
  if (!success) return errorResponse("Rate limit exceeded", 429);

  try {
    const ctx = await getWorkspaceContext();

    if (!ctx) {
      return NextResponse.json({ brief: "Workspace context unavailable." });
    }

    const contextBlock = formatWorkspacePrompt(ctx);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.5,
      max_tokens: 80,
      messages: [
        {
          role: "system",
          content: `You are Orbit AI. Given the workspace context below, write exactly one sentence identifying the single most important thing that needs attention today. Be specific — use actual names from the data. Max 30 words. No preamble.

${contextBlock}`,
        },
        {
          role: "user",
          content: "What is the single most important thing that needs attention today?",
        },
      ],
    });

    const brief =
      completion.choices[0]?.message?.content?.trim() ??
      "No urgent items detected — workspace is on track.";

    return NextResponse.json({ brief });
  } catch (error) {
    console.error("ai/brief error:", error);
    return errorResponse("AI request failed");
  }
}

export async function GET() {
  return errorResponse("Method not allowed", 405);
}
