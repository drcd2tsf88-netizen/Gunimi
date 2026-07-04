"use server";

import { openai } from "@/lib/ai/providers/openai";

type GenerateResponseProps = {
  message: string;

  orbitContext: string;

  agent: string;
};

export async function generateResponse({
  message,

  orbitContext,

  agent,
}: GenerateResponseProps) {
  try {
    const completion =
      await openai.chat.completions.create(
        {
          model: "gpt-4.1-mini",

          temperature: 0.7,

          messages: [
            {
              role: "system",

              content: `
You are ${agent}, part of Gunimi AI Workspace OS.

${orbitContext}

Respond as a premium AI business operating system assistant.
Focus on:
- operational clarity
- actionable insights
- intelligent workflows
- concise strategic communication
`,
            },

            {
              role: "user",

              content: message,
            },
          ],
        }
      );

    return (
      completion.choices[0]
        ?.message?.content ??
      "Orbit AI could not generate a response."
    );
  } catch (error) {
    console.error(error);

    return "Orbit AI encountered an error while processing the request.";
  }
}