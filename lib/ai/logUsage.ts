import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export type AIFeature = "chat" | "brief" | "assistant" | "summary";

// GPT-4.1-mini pricing (USD per token)
const INPUT_COST_PER_TOKEN = 0.4 / 1_000_000;   // $0.40 / 1M tokens
const OUTPUT_COST_PER_TOKEN = 1.6 / 1_000_000;  // $1.60 / 1M tokens

export function estimateCostUsd(inputTokens: number, outputTokens: number): number {
  return inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN;
}

export async function logAIUsage({
  workspaceId,
  userId,
  feature,
  model = "gpt-4.1-mini",
  provider = "openai",
  inputTokens,
  outputTokens,
}: {
  workspaceId: string | null;
  userId: string | null;
  feature: AIFeature;
  model?: string;
  provider?: string;
  inputTokens: number;
  outputTokens: number;
}): Promise<void> {
  try {
    await supabaseAdmin.from("ai_usage_logs").insert({
      workspace_id: workspaceId,
      user_id: userId,
      feature,
      model,
      provider,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost_usd: estimateCostUsd(inputTokens, outputTokens),
    });
  } catch (err) {
    console.error("[logAIUsage] failed:", err);
  }
}
