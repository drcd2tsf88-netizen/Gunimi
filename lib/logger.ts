/**
 * Structured server logger.
 *
 * Use this in server actions, API routes, and lib/ modules.
 * Never use console.log / console.debug / console.info in production code.
 * console.error is acceptable on the server for unexpected failures but
 * must never appear in client components.
 *
 * Client components must be completely silent in production — remove
 * all console calls from "use client" files.
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /** Unexpected server-side failures. Always logged in production server logs. */
  error(message: unknown, ...args: unknown[]): void {
    if (typeof message === "string") {
      console.error(`[orbit] ${message}`, ...args);
    } else {
      console.error("[orbit]", message, ...args);
    }
  },

  /** Expected degraded states during development only. */
  warn(message: string, ...args: unknown[]): void {
    if (isDev) console.warn(`[orbit] ${message}`, ...args);
  },

  /** Debug output. Development only, never reaches production. */
  debug(message: string, ...args: unknown[]): void {
    if (isDev) console.log(`[orbit] ${message}`, ...args);
  },
};
