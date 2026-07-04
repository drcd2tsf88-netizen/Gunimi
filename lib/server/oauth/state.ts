import { createHmac, timingSafeEqual } from "crypto";

// OAuth state TTL: 5 minutes. Rejects any state older than this.
const STATE_TTL_MS = 5 * 60 * 1000;

interface OAuthStatePayload {
  workspaceId: string;
  userId: string;
  timestamp: number;
}

/**
 * Creates an HMAC-SHA256-signed OAuth state parameter.
 * Format: base64url(payload).base64url(signature)
 *
 * Requires OAUTH_STATE_SECRET in environment variables.
 */
export function createOAuthState(workspaceId: string, userId: string): string {
  const secret = process.env.OAUTH_STATE_SECRET;
  if (!secret) throw new Error("OAUTH_STATE_SECRET is not configured");

  const payload: OAuthStatePayload = {
    workspaceId,
    userId,
    timestamp: Date.now(),
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${signature}`;
}

/**
 * Verifies an HMAC-signed OAuth state parameter.
 *
 * Returns the decoded payload when:
 *   - The signature is valid (HMAC-SHA256, timing-safe comparison)
 *   - The state has not expired (within STATE_TTL_MS)
 *
 * Returns null on any failure — never throws.
 */
export function verifyOAuthState(
  state: string
): { workspaceId: string; userId: string } | null {
  try {
    const secret = process.env.OAUTH_STATE_SECRET;
    if (!secret) return null;

    const dotIndex = state.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const encoded = state.slice(0, dotIndex);
    const receivedSig = state.slice(dotIndex + 1);

    // Timing-safe signature comparison — prevents timing oracle attacks
    const expectedSig = createHmac("sha256", secret)
      .update(encoded)
      .digest("base64url");

    const receivedBuf = Buffer.from(receivedSig);
    const expectedBuf = Buffer.from(expectedSig);

    if (
      receivedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(receivedBuf, expectedBuf)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString()
    ) as OAuthStatePayload;

    const { workspaceId, userId, timestamp } = payload;
    if (!workspaceId || !userId || typeof timestamp !== "number") return null;

    // Reject expired states
    if (Date.now() - timestamp > STATE_TTL_MS) return null;

    return { workspaceId, userId };
  } catch {
    return null;
  }
}
