"use server";

import { revalidatePath } from "next/cache";
import { getTagAiSummary } from "./getTagAiSummary";

export async function refreshTagAiSummary(tagId: string): Promise<string | null> {
  const summary = await getTagAiSummary(tagId, true);
  revalidatePath(`/dashboard/tags/${tagId}`);
  return summary;
}
