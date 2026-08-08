"use server";

import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function checkWriteRateLimit(userId: string): Promise<boolean> {
  try {
    const { success } = await ratelimit.limit(`write:${userId}`);
    if (!success) {
      logger.warn("Rate limit exceeded", { userId });
    }
    return success;
  } catch {
    return true;
  }
}
