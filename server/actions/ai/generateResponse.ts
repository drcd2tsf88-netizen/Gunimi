"use server";

import { openai } from "@/lib/ai/providers/openai";

type GenerateResponseProps = {
  message: string;

  orbitContext: string;

  agent: string;
};

export type OrbitAIResponse = {
  response: string;

  actions: string[];

  insights: string[];

  workflow: string[];
};

export async function generateResponse({
  message,

  orbitContext,

  agent,
}: GenerateResponseProps): Promise<OrbitAIResponse> {
  try {
    const completion =
      await openai.chat.completions.create(
        {
          model: "gpt-4.1-mini",

          temperature: 0.7,

          response_format: {
            type: "json_object",
          },

          messages: [
            {
              role: "system",

              content: `
You are ${agent}, part of Gunimi AI Workspace OS.

${orbitContext}

Return ONLY valid JSON.

Required JSON structure:

{
  "response": "AI response",

  "actions": [
    "Action 1"
  ],

  "insights": [
    "Insight 1"
  ],

  "workflow": [
    "Step 1"
  ]
}

Focus on:
- operational clarity
- business intelligence
- productivity
- CRM workflows
- execution systems
- concise AI communication
`,
            },

            {
              role: "user",

              content: message,
            },
          ],
        }
      );

    const content =
      completion.choices[0]
        ?.message?.content;

    if (!content) {
      return {
        response:
          "Gunimi AI could not generate a response.",

        actions: [],

        insights: [],

        workflow: [],
      };
    }

    return JSON.parse(content);
  } catch {
    return {
      response:
        "Gunimi AI encountered an error while processing the request.",

      actions: [],

      insights: [],

      workflow: [],
    };
  }
}