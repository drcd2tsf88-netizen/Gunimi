/**
 * Transport abstraction for command execution.
 *
 * The current implementation uses Next.js Server Actions (request-response).
 * Future streaming AI commands require a different transport — SSE or WebSocket.
 * Swapping the transport only requires a new CommandTransport implementation;
 * the palette orchestration layer is unchanged.
 */

export type ExecutionResult =
  | { ok: true }
  | { ok: false; error: string };

export interface CommandTransport {
  execute(
    action: string,
    options?: { signal?: AbortSignal }
  ): Promise<ExecutionResult>;
}
