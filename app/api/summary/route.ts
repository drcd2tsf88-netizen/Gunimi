import OpenAI from "openai";

import { getUser }
from "@/lib/server/auth";

import { ratelimit }
from "@/lib/ratelimit";

import {
  errorResponse,
} from "@/lib/server/apiResponse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const note = body.note;

    if (
      !note ||
      typeof note !== "string" ||
      !note.trim()
    ) {
      return errorResponse("Note content required", 400);
    }

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI business assistant that summarizes company meeting notes into concise summaries and action points.",
          },
          {
            role: "user",
            content: note.slice(0, 8000),
          },
        ],
      });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return errorResponse("AI summary failed");
  }
}
