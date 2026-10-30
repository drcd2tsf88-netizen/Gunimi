import { openai } from "@/lib/ai/providers/openai";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";

export type OrderIntentResult = {
  detected: boolean;
  confidence: "high" | "medium" | "low";
  summary: string | null;
};

const SYSTEM_PROMPT = `You detect ORDER INTENT in inbound business emails.

An email has order intent when:
1. The sender is requesting to PURCHASE or ORDER a product/service
2. The sender is asking for a QUOTE or PROPOSAL for a specific product/service
3. The sender confirms they want to PROCEED with a purchase
4. The sender asks about AVAILABILITY, PRICING, or DELIVERY for something specific they want to buy

NOT order intent:
- General inquiries without purchase intent
- Support or complaint emails
- Partnership or collaboration requests
- Newsletter or marketing emails
- Internal communications

Return JSON: {"detected": boolean, "confidence": "high"|"medium"|"low", "summary": "one sentence describing what they want to order, or null if not detected"}

Be conservative — only flag clear purchase/order intent.`;

export async function detectOrderIntent(
  workspaceId: string,
  userId: string,
  subject: string,
  snippet: string,
): Promise<OrderIntentResult> {
  const budget = await checkAIBudget(workspaceId);
  if (!budget.allowed) return { detected: false, confidence: "low", summary: null };

  const userContent = `Subject: ${subject}\nEmail body: ${snippet.slice(0, 500)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0,
    max_tokens: 150,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? '{"detected":false,"confidence":"low","summary":null}';
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
    const parsed = JSON.parse(raw) as Partial<OrderIntentResult>;
    return {
      detected: parsed.detected === true,
      confidence: parsed.confidence ?? "low",
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 200) : null,
    };
  } catch {
    return { detected: false, confidence: "low", summary: null };
  }
}
