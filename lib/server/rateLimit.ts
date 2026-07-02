"use server";

import { ratelimit } from "@/lib/ratelimit";

/**
 * Apply rate limiting for write server actions. Returns false if the user
 * has exceeded the allowed rate (30 writes/min sliding window).
 * Fails open if Redis is unavailable to avoid blocking legitimate users.
 */
export async function checkWriteRateLimit(userId: string): Promise<boolean> {
  try {
    const { success } = await ratelimit.limit(`write:${userId}`);
    return success;
  } catch {
    return true;
  }
}
