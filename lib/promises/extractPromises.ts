import { openai } from "@/lib/ai/providers/openai";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";

export type ExtractedPromise = {
  text: string;
  daysUntilDeadline: number | null;
};

const SYSTEM_PROMPT = `You extract SPECIFIC, ACTIONABLE commitments from outbound business emails.

A valid commitment requires ALL of these:
1. The SENDER promises to do something (not the recipient)
2. It is a SPECIFIC action (send a document, make a call, prepare a proposal, schedule a meeting)
3. It is NOT a vague social phrase ("let me know", "we'll be in touch", "I hope to hear from you", "feel free to contact me")

Return JSON: {"items": [{"text": "short actionable task title under 60 chars", "days": number|null}]}
"days" = days until deadline from today (null if no explicit deadline).

Examples of VALID commitments:
- "I'll send you the contract by Friday" → days: 3 (or however many until Friday)
- "I'll call you on Monday" → days: 2
- "I'm preparing the proposal for next week" → days: 7

Examples of INVALID (return empty):
- "Let me know if you have questions"
- "Looking forward to hearing from you"
- "Feel free to reach out"
- "We'll be in touch"
- "I hope we can work together"

Return {"items": []} if no valid specific commitments found. Be strict — false negatives are better than false positives.`;

export async function extractPromises(
  workspaceId: string,
  userId: string,
  subject: string,
  snippet: string,
): Promise<ExtractedPromise[]> {
  const budget = await checkAIBudget(workspaceId);
  if (!budget.allowed) return [];

  const userContent = `Subject: ${subject}\nEmail: ${snippet}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? '{"items":[]}';
  const usage = response.usage;

  await logAIUsage({
    workspaceId,
    userId,
    feature: "summary",
    model: "gpt-4.1-mini",
    inputTokens: usage?.prompt_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
  });

  try {
    const parsed = JSON.parse(raw) as { items?: unknown[] };
    const arr = parsed.items ?? [];
    return arr
      .filter((item): item is { text: string; days: number | null } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).text === "string",
      )
      .map((item) => ({
        text: item.text.slice(0, 80),
        daysUntilDeadline: typeof item.days === "number" ? item.days : null,
      }));
  } catch {
    return [];
  }
}
