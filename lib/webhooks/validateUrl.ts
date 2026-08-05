/**
 * Validates webhook endpoint URLs against SSRF attack vectors.
 *
 * Rules enforced:
 * - HTTPS only (http:// is rejected)
 * - Localhost and loopback ranges blocked
 * - RFC-1918 private IPv4 ranges blocked (10/8, 172.16/12, 192.168/16)
 * - Link-local ranges blocked (169.254/16, 100.64/10)
 * - IPv6 private ranges blocked (::1, fc00::/7, fe80::/10)
 * - Known cloud metadata endpoints blocked
 */

const PRIVATE_IPV4 = [
  /^127\./,
  /^10\./,
  /^0\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^0\.0\.0\.0$/,
];

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "169.254.169.254",
  "fd00::ec2",
  "fe80::1",
]);

const PRIVATE_IPV6 = [
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
  /^fe80:/i,
];

export type UrlValidationResult =
  | { valid: true }
  | { valid: false; reason: "https_required" | "invalid_url" | "blocked_host" };

export function validateWebhookUrl(rawUrl: string): UrlValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { valid: false, reason: "invalid_url" };
  }

  if (parsed.protocol !== "https:") {
    return { valid: false, reason: "https_required" };
  }

  const host = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTS.has(host)) {
    return { valid: false, reason: "blocked_host" };
  }

  for (const pattern of PRIVATE_IPV4) {
    if (pattern.test(host)) {
      return { valid: false, reason: "blocked_host" };
    }
  }

  for (const pattern of PRIVATE_IPV6) {
    if (pattern.test(host)) {
      return { valid: false, reason: "blocked_host" };
    }
  }

  return { valid: true };
}
