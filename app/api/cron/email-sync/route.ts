// Vercel Cron — Background Email Sync
// Runs every 15 minutes: */15 * * * *
// Incrementally syncs all active email connections since their last_synced_at.
// Auth: Bearer ${CRON_SECRET}

import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { syncEmailConnection } from "@/lib/email/sync";
import { processEmailPromises } from "@/lib/promises/processEmailPromises";
import { logger } from "@/lib/logger";

type ConnectionRow = {
  id: string;
  workspace_id: string;
  user_id: string;
  provider: string;
};

type ConnectionReport = {
  connectionId: string;
  workspaceId: string;
  provider: string;
  synced: number;
  linked: number;
  error?: string;
};

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("[EmailSync] CRON_SECRET is not set");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startMs = Date.now();

  // Fetch all connections that have a valid access token
  const { data: connections, error } = await supabaseAdmin
    .from("email_connections")
    .select("id, workspace_id, user_id, provider")
    .not("access_token", "is", null);

  if (error || !connections) {
    logger.error("[EmailSync] Failed to fetch email connections", error);
    return Response.json({ error: "Failed to fetch connections" }, { status: 500 });
  }

  const reports: ConnectionReport[] = [];
  const TIME_BUDGET_MS = 20_000;

  for (const conn of connections as ConnectionRow[]) {
    if (Date.now() - startMs > TIME_BUDGET_MS) break;

    try {
      const result = await syncEmailConnection(conn.id);

      // After sync — scan new outbound emails for promises
      try {
        await processEmailPromises(conn.workspace_id, conn.user_id, conn.id);
      } catch (promiseErr) {
        logger.error(`[EmailSync] Promise processing failed for ${conn.id}`, {
          error: promiseErr instanceof Error ? promiseErr.message : "Unknown",
        });
      }

      reports.push({
        connectionId: conn.id,
        workspaceId: conn.workspace_id,
        provider: conn.provider,
        synced: result.synced,
        linked: result.linked,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error(`[EmailSync] Failed for connection ${conn.id}`, { error: message });
      reports.push({
        connectionId: conn.id,
        workspaceId: conn.workspace_id,
        provider: conn.provider,
        synced: 0,
        linked: 0,
        error: message,
      });
    }
  }

  const errors = reports.filter((r) => r.error).length;

  return Response.json({
    ok: true,
    connectionsProcessed: reports.length,
    totalSynced: reports.reduce((s, r) => s + r.synced, 0),
    totalLinked: reports.reduce((s, r) => s + r.linked, 0),
    errors,
    totalDurationMs: Date.now() - startMs,
  });
}
