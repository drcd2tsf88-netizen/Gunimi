// Vercel Cron — Daily Workspace Digest
// Schedule: 0 7 * * * (every day at 07:00 UTC)
// For each workspace member, sends a digest of today's meetings, due tasks, and active signals.
// Skips if nothing to show. Deduplicates via workspace_notifications.

import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { sendDailyDigest, type DigestTask, type DigestMeeting, type DigestSignal } from "@/lib/email/sendDailyDigest";
import { getActiveSignalsForWorkspace } from "@/lib/signals/queries";
import enMessages from "@/locales/en.json";
import skMessages from "@/locales/sk.json";
import csMessages from "@/locales/cs.json";

type LocaleMessages = typeof enMessages;

function getSignalTitle(type: string, lang?: string | null): string {
  const l = (lang ?? "en").toLowerCase().slice(0, 2);
  const msgs = l === "sk" ? skMessages : l === "cs" ? csMessages : enMessages;
  const types = (msgs as unknown as { signals?: { types?: Record<string, string> } }).signals?.types ?? {};
  return types[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WorkspaceRow = {
  id: string;
  name: string;
  preferences: { language?: string } | null;
};

type MemberRow = {
  user_id: string;
  profiles: { full_name: string | null }[] | { full_name: string | null } | null;
};

type TaskRow = {
  id: string;
  title: string;
  due_date: string;
};

async function resolveEntityNames(
  signals: { entityId: string; entityType: string }[],
  workspaceId: string,
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (signals.length === 0) return result;

  const contactIds = signals.filter((s) => s.entityType === "contact").map((s) => s.entityId);
  const dealIds    = signals.filter((s) => s.entityType === "deal").map((s) => s.entityId);
  const companyIds = signals.filter((s) => s.entityType === "company").map((s) => s.entityId);

  await Promise.all([
    contactIds.length
      ? supabaseAdmin
          .from("workspace_people")
          .select("id, full_name")
          .eq("workspace_id", workspaceId)
          .in("id", contactIds)
          .then(({ data }) => data?.forEach((r) => result.set(r.id as string, r.full_name as string)))
      : null,
    dealIds.length
      ? supabaseAdmin
          .from("workspace_deals")
          .select("id, name")
          .eq("workspace_id", workspaceId)
          .in("id", dealIds)
          .then(({ data }) => data?.forEach((r) => result.set(r.id as string, r.name as string)))
      : null,
    companyIds.length
      ? supabaseAdmin
          .from("workspace_companies")
          .select("id, name")
          .eq("workspace_id", workspaceId)
          .in("id", companyIds)
          .then(({ data }) => data?.forEach((r) => result.set(r.id as string, r.name as string)))
      : null,
  ]);

  return result;
}

type MeetingRow = {
  id: string;
  title: string;
  start_at: string;
};

export async function GET(request: NextRequest) {
  // ─── Auth ─────────────────────────────────────────────────────────────────

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("[DailyDigest] CRON_SECRET not set");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startMs = Date.now();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.gunimi.com";
  const dashboardUrl = `${appUrl}/dashboard`;

  const todayStr = new Date().toISOString().split("T")[0]!;
  const startOfDay = `${todayStr}T00:00:00.000Z`;
  const endOfDay = `${todayStr}T23:59:59.999Z`;

  // ─── Fetch workspaces ─────────────────────────────────────────────────────

  const { data: workspaces, error: wsError } = await supabaseAdmin
    .from("workspaces")
    .select("id, name, preferences");

  if (wsError || !workspaces) {
    logger.error("[DailyDigest] Failed to fetch workspaces", wsError);
    return Response.json({ error: "db_error" }, { status: 500 });
  }

  let totalSent = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  const debugInfo: { ws: string; lang: string | null; signals: number; tasks?: number }[] = [];

  for (const ws of workspaces as WorkspaceRow[]) {
    const wsLang = ws.preferences?.language ?? null;
    debugInfo.push({ ws: ws.name, lang: wsLang, signals: 0 });
    try {
      // ─── Workspace-level data ──────────────────────────────────────────

      const [signalsRaw, meetingsRes, membersRes] = await Promise.all([
        getActiveSignalsForWorkspace(ws.id, supabaseAdmin),
        supabaseAdmin
          .from("calendar_events")
          .select("id, title, start_at")
          .eq("workspace_id", ws.id)
          .neq("status", "cancelled")
          .gte("start_at", startOfDay)
          .lte("start_at", endOfDay)
          .order("start_at", { ascending: true })
          .limit(10),
        supabaseAdmin
          .from("workspace_members")
          .select("user_id, profiles(full_name)")
          .eq("workspace_id", ws.id),
      ]);

      const meetings: DigestMeeting[] = ((meetingsRes.data ?? []) as MeetingRow[]).map((m) => ({
        id: m.id,
        title: m.title,
        startAt: m.start_at,
      }));

      // Resolve entity names for signals
      const topSignals = signalsRaw.slice(0, 5);
      const entityNames = await resolveEntityNames(topSignals, ws.id);

      const signals: DigestSignal[] = topSignals.map((sig) => ({
        id: sig.id,
        title: getSignalTitle(sig.type, wsLang),
        summary: "",
        entityName: entityNames.get(sig.entityId) ?? "",
      }));

      const dbgEntry = debugInfo[debugInfo.length - 1];
      if (dbgEntry) dbgEntry.signals = signals.length;

      const members = (membersRes.data ?? []) as unknown as MemberRow[];

      // ─── Per-member ────────────────────────────────────────────────────

      for (const member of members) {
        try {
          // Dedup: skip if digest already sent today
          const { data: existing } = await supabaseAdmin
            .from("workspace_notifications")
            .select("id")
            .eq("workspace_id", ws.id)
            .eq("user_id", member.user_id)
            .eq("type", "daily_digest")
            .gte("created_at", startOfDay)
            .maybeSingle();

          if (existing) {
            totalSkipped++;
            continue;
          }

          // Tasks due today or overdue (assigned to this user)
          const { data: taskData } = await supabaseAdmin
            .from("workspace_tasks")
            .select("id, title, due_date")
            .eq("workspace_id", ws.id)
            .eq("assigned_to", member.user_id)
            .neq("status", "done")
            .lte("due_date", todayStr)
            .not("due_date", "is", null)
            .order("due_date", { ascending: true })
            .limit(10);

          const tasks: DigestTask[] = ((taskData ?? []) as TaskRow[]).map((t) => ({
            id: t.id,
            title: t.title,
            isOverdue: t.due_date < todayStr,
          }));

          // Skip only if truly nothing to show
          if (tasks.length === 0 && meetings.length === 0 && signals.length === 0) {
            totalSkipped++;
            continue;
          }

          // Get user email
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(member.user_id);
          const userEmail = userData?.user?.email;

          logger.debug(`[DailyDigest] Sending to ${userEmail ?? member.user_id}: ${tasks.length} tasks, ${meetings.length} meetings, ${signals.length} signals`);
          if (!userEmail) {
            totalSkipped++;
            continue;
          }

          const profileData = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
          const fullName = profileData?.full_name ?? userEmail;

          await sendDailyDigest({
            email: userEmail,
            name: fullName,
            workspaceName: ws.name,
            language: ws.preferences?.language,
            tasks,
            meetings,
            signals,
            dashboardUrl,
          });

          // Log dedup record
          await supabaseAdmin.from("workspace_notifications").insert({
            workspace_id: ws.id,
            user_id: member.user_id,
            type: "daily_digest",
            title: "Daily digest sent",
            href: dashboardUrl,
          });

          totalSent++;
        } catch (memberErr) {
          logger.error(`[DailyDigest] Failed for member ${member.user_id} in workspace ${ws.id}`, memberErr);
          totalFailed++;
        }
      }
    } catch (wsErr) {
      logger.error(`[DailyDigest] Failed for workspace ${ws.id}`, wsErr);
      totalFailed++;
    }
  }

  logger.debug("[DailyDigest] Run complete", { totalSent, totalSkipped, totalFailed, durationMs: Date.now() - startMs });

  return Response.json({
    ok: true,
    totalSent,
    totalSkipped,
    totalFailed,
    durationMs: Date.now() - startMs,
    debug: debugInfo,
  });
}
