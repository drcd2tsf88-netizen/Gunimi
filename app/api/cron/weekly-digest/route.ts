// Vercel Cron — Weekly Workspace Digest
// Schedule: 0 7 * * 1 (every Monday at 07:00 UTC)
// Sends the workspace owner a weekly AI-powered digest: signals, pipeline health, relationships.
// Owner-only. Deduplicates via workspace_notifications (type: "weekly_digest").

import { type NextRequest } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import {
  sendWeeklyDigest,
  type WeeklySignal,
  type WeeklyDeal,
  type WeeklyRelationship,
} from "@/lib/email/sendWeeklyDigest";
import { getActiveSignalsForWorkspace } from "@/lib/signals/queries";
import { computeDealHealth } from "@/lib/deals/dealHealth";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";
import enMessages from "@/locales/en.json";
import skMessages from "@/locales/sk.json";
import csMessages from "@/locales/cs.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type WorkspaceRow = {
  id: string;
  name: string;
  preferences: { language?: string; emailDigest?: boolean } | null;
};

type MemberRow = {
  user_id: string;
  role: string;
  profiles: { full_name: string | null }[] | { full_name: string | null } | null;
};

type DealRow = {
  id: string;
  title: string;
  stage: string;
  probability: number | null;
  updated_at: string | null;
  expected_close_date: string | null;
};

type PersonRow = {
  id: string;
  name: string;
  last_contacted_at: string | null;
};

const MS_PER_DAY = 86_400_000;

function getSignalTitle(type: string, lang?: string | null): string {
  const l = (lang ?? "en").toLowerCase().slice(0, 2);
  const msgs = l === "sk" ? skMessages : l === "cs" ? csMessages : enMessages;
  const types = (msgs as unknown as { signals?: { types?: Record<string, string> } }).signals?.types ?? {};
  return types[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildWeekLabel(dateLocale: string): string {
  const now = new Date();
  // Last week: Mon to Sun
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(now.getTime() - daysToMonday * MS_PER_DAY);
  const lastMonday = new Date(thisMonday.getTime() - 7 * MS_PER_DAY);
  const lastSunday = new Date(lastMonday.getTime() + 6 * MS_PER_DAY);

  const fmt = (d: Date) =>
    d.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
  return `${fmt(lastMonday)} – ${fmt(lastSunday)}`;
}

function getDateLocale(lang?: string | null): string {
  const l = (lang ?? "en").toLowerCase().slice(0, 2);
  if (l === "sk") return "sk-SK";
  if (l === "cs") return "cs-CZ";
  return "en-US";
}

function computeSimpleContactScore(lastContactedAt: string | null): number {
  if (!lastContactedAt) return 5;
  const days = Math.floor((Date.now() - new Date(lastContactedAt).getTime()) / MS_PER_DAY);
  if (days <= 7)  return 85;
  if (days <= 14) return 70;
  if (days <= 30) return 55;
  if (days <= 60) return 35;
  if (days <= 90) return 18;
  return 8;
}

async function generateNarrative(
  workspaceId: string,
  workspaceName: string,
  signalCount: number,
  dealCount: number,
  atRiskContacts: number,
  weekLabel: string,
): Promise<string | null> {
  try {
    const budget = await checkAIBudget(workspaceId);
    if (!budget.allowed) return null;

    const context = [
      `Workspace: ${workspaceName}`,
      `Week: ${weekLabel}`,
      `Active signals: ${signalCount}`,
      `Open deals: ${dealCount}`,
      `Contacts needing attention: ${atRiskContacts}`,
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: `You are Gunimi, a calm executive assistant. Write a 2-3 sentence weekly summary for the workspace owner.

Rules:
- Be specific — mention the numbers from the context
- Sound like a trusted colleague giving a Monday morning briefing
- No AI labels, no markdown, no jargon
- Start with the biggest opportunity or concern
- End with a forward-looking note`,
        },
        { role: "user", content: context },
      ],
    });

    void logAIUsage({
      workspaceId,
      userId: null,
      feature: "summary",
      inputTokens: completion.usage?.prompt_tokens ?? 0,
      outputTokens: completion.usage?.completion_tokens ?? 0,
    });

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  // ─── Auth ─────────────────────────────────────────────────────────────────

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("[WeeklyDigest] CRON_SECRET not set");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry_run") === "true";
  const startMs = Date.now();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.gunimi.com";
  const dashboardUrl = `${appUrl}/dashboard`;

  // Dedup window: start of Monday 00:00 UTC this week
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(now.getTime() - daysToMonday * MS_PER_DAY);
  thisMonday.setUTCHours(0, 0, 0, 0);
  const weekStart = thisMonday.toISOString();

  // ─── Fetch workspaces ─────────────────────────────────────────────────────

  const { data: workspaces, error: wsError } = await supabaseAdmin
    .from("workspaces")
    .select("id, name, preferences");

  if (wsError || !workspaces) {
    logger.error("[WeeklyDigest] Failed to fetch workspaces", wsError);
    return Response.json({ error: "db_error" }, { status: 500 });
  }

  let totalSent = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const ws of workspaces as WorkspaceRow[]) {
    if (ws.preferences?.emailDigest === false) {
      totalSkipped++;
      continue;
    }

    try {
      // ─── Find owner ──────────────────────────────────────────────────────

      const { data: membersData } = await supabaseAdmin
        .from("workspace_members")
        .select("user_id, role, profiles(full_name)")
        .eq("workspace_id", ws.id)
        .eq("role", "owner")
        .limit(1);

      const owner = ((membersData ?? []) as unknown as MemberRow[])[0];
      if (!owner) {
        totalSkipped++;
        continue;
      }

      // ─── Dedup: already sent this week? ──────────────────────────────────

      const { data: existing } = await supabaseAdmin
        .from("workspace_notifications")
        .select("id")
        .eq("workspace_id", ws.id)
        .eq("user_id", owner.user_id)
        .eq("type", "weekly_digest")
        .gte("created_at", weekStart)
        .maybeSingle();

      if (existing) {
        totalSkipped++;
        continue;
      }

      // ─── Gather data ──────────────────────────────────────────────────────

      const lang = ws.preferences?.language ?? null;
      const dateLocale = getDateLocale(lang);
      const weekLabel = buildWeekLabel(dateLocale);

      const [signalsRaw, dealsRes, peopleRes] = await Promise.all([
        getActiveSignalsForWorkspace(ws.id, supabaseAdmin),
        supabaseAdmin
          .from("workspace_deals")
          .select("id, title, stage, probability, updated_at, expected_close_date")
          .eq("workspace_id", ws.id)
          .neq("stage", "won")
          .neq("stage", "lost")
          .order("updated_at", { ascending: false })
          .limit(10),
        supabaseAdmin
          .from("workspace_people")
          .select("id, name, last_contacted_at")
          .eq("workspace_id", ws.id)
          .order("last_contacted_at", { ascending: true, nullsFirst: true })
          .limit(10),
      ]);

      // ─── Signals ──────────────────────────────────────────────────────────

      const resolvedSignals = await resolveEntityNames(signalsRaw.slice(0, 6), ws.id);
      const signals: WeeklySignal[] = signalsRaw.slice(0, 6).map((sig) => ({
        title: getSignalTitle(sig.type, lang),
        entityName: resolvedSignals.get(sig.entityId) ?? "",
      }));

      // ─── Deals ───────────────────────────────────────────────────────────

      const rawDeals = (dealsRes.data ?? []) as DealRow[];
      const deals: WeeklyDeal[] = rawDeals.map((d) => {
        const health = computeDealHealth(
          d.probability ?? undefined,
          d.updated_at ?? undefined,
          d.expected_close_date ?? undefined,
          d.stage,
        );
        const healthDot: WeeklyDeal["healthDot"] =
          health.tier === "healthy" ? "green"
          : health.tier === "warning" ? "amber"
          : "red";
        return { id: d.id, title: d.title, stage: d.stage, healthDot };
      }).sort((a, b) => {
        const order = { red: 0, amber: 1, green: 2, neutral: 3 };
        return order[a.healthDot] - order[b.healthDot];
      });

      // ─── Relationships ────────────────────────────────────────────────────

      const rawPeople = (peopleRes.data ?? []) as PersonRow[];
      const relationships: WeeklyRelationship[] = rawPeople.map((p) => ({
        id: p.id,
        name: p.name,
        score: computeSimpleContactScore(p.last_contacted_at),
      }));

      const atRiskCount = relationships.filter((r) => r.score < 30).length;

      // ─── AI narrative ─────────────────────────────────────────────────────

      const aiNarrative = await generateNarrative(
        ws.id,
        ws.name,
        signals.length,
        deals.length,
        atRiskCount,
        weekLabel,
      );

      // ─── Owner email ──────────────────────────────────────────────────────

      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(owner.user_id);
      const ownerEmail = userData?.user?.email;
      if (!ownerEmail) {
        totalSkipped++;
        continue;
      }

      const profileData = Array.isArray(owner.profiles) ? owner.profiles[0] : owner.profiles;
      const fullName = profileData?.full_name ?? ownerEmail;

      if (!dryRun) {
        await sendWeeklyDigest({
          email: ownerEmail,
          name: fullName,
          workspaceName: ws.name,
          language: lang ?? undefined,
          aiNarrative,
          signals,
          deals,
          relationships,
          dashboardUrl,
          weekLabel,
        });

        await supabaseAdmin.from("workspace_notifications").insert({
          workspace_id: ws.id,
          user_id: owner.user_id,
          type: "weekly_digest",
          title: "Weekly digest sent",
          href: dashboardUrl,
        });
      }

      totalSent++;
    } catch (wsErr) {
      logger.error(`[WeeklyDigest] Failed for workspace ${ws.id}`, wsErr);
      totalFailed++;
    }
  }

  logger.debug("[WeeklyDigest] Run complete", {
    totalSent,
    totalSkipped,
    totalFailed,
    durationMs: Date.now() - startMs,
  });

  return Response.json({
    ok: true,
    dryRun,
    totalSent,
    totalSkipped,
    totalFailed,
    durationMs: Date.now() - startMs,
  });
}

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
          .select("id, name")
          .eq("workspace_id", workspaceId)
          .in("id", contactIds)
          .then(({ data }) => data?.forEach((r) => result.set(r.id as string, r.name as string)))
      : null,
    dealIds.length
      ? supabaseAdmin
          .from("workspace_deals")
          .select("id, title")
          .eq("workspace_id", workspaceId)
          .in("id", dealIds)
          .then(({ data }) => data?.forEach((r) => result.set(r.id as string, r.title as string)))
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
