"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type {
  MorningIntelligence,
} from "@/server/actions/ai/getMorningIntelligence";

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = "gunimi_morning_intel_v2";
const CACHE_TTL_MS = 30 * 60 * 1000;

type CacheEntry = { data: MorningIntelligence; ts: number };

function readCache(): MorningIntelligence | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: MorningIntelligence): void {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, ts: Date.now() } satisfies CacheEntry)
    );
  } catch {}
}

function extractFirstName(displayName: string | undefined): string | null {
  if (!displayName?.trim()) return null;
  return displayName.trim().split(/\s+/)[0] ?? null;
}

// ─── Loading skeleton with rotating phrases ───────────────────────────────────

function LoadingSkeleton({ phrases }: { phrases: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % phrases.length);
    }, 2200);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A0E17]">
      <div className="px-6 pb-5 pt-6">
        <div className="mb-1.5 h-2.5 w-32 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-5 w-72 animate-pulse rounded-full bg-white/[0.04]" />
      </div>
      <div className="border-t border-white/[0.05] px-6 pb-5 pt-4">
        <div className="mb-3 h-1.5 w-20 animate-pulse rounded-full bg-white/[0.04]" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2.5 animate-pulse rounded-full bg-white/[0.04]"
              style={{ width: `${75 - i * 12}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.05] px-6 pb-4 pt-3">
        <p
          key={idx}
          className="text-[11px] text-white/20 transition-opacity duration-500"
        >
          {phrases[idx]}
        </p>
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const t = useTranslations("dashboard");
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A0E17]">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-sm text-white/30">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/35 transition-colors hover:text-white/60"
        >
          <RefreshCw size={11} />
          {t("briefRefresh")}
        </button>
      </div>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-white/[0.05]" />;
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-white/20">
      {children}
    </p>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

type Props = {
  onOpenAI?: () => void;
  displayName?: string;
};

export default function MorningIntelligenceCard({ onOpenAI, displayName }: Props) {
  const t = useTranslations("dashboard");

  const loadingPhrases = [
    t("briefLoadingPhrase1"),
    t("briefLoadingPhrase2"),
    t("briefLoadingPhrase3"),
    t("briefLoadingPhrase4"),
  ];

  const [data, setData] = useState<MorningIntelligence | null>(() => readCache());
  const [loading, setLoading] = useState<boolean>(() => readCache() === null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const firstName = extractFirstName(displayName);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!loading) return;

    fetch("/api/morning-intelligence", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return Promise.reject(new Error(`${res.status}`));
        return res.json() as Promise<MorningIntelligence>;
      })
      .then((intel) => {
        if (!isMounted.current) return;
        writeCache(intel);
        setData(intel);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted.current) return;
        setError(true);
        setLoading(false);
      });
  }, [loading]);

  function handleRefresh() {
    setRefreshing(true);
    setError(false);

    fetch("/api/morning-intelligence", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return Promise.reject(new Error(`${res.status}`));
        return res.json() as Promise<MorningIntelligence>;
      })
      .then((intel) => {
        if (!isMounted.current) return;
        writeCache(intel);
        setData(intel);
        setRefreshing(false);
      })
      .catch(() => {
        if (!isMounted.current) return;
        setError(true);
        setRefreshing(false);
      });
  }

  // Greeting derived from time of day
  function getGreeting(): string {
    const hour = new Date().getHours();
    const salutation =
      hour < 12
        ? t("briefGreetingMorning")
        : hour < 17
          ? t("briefGreetingAfternoon")
          : t("briefGreetingEvening");
    return firstName ? `${salutation}, ${firstName}.` : `${salutation}.`;
  }

  if (loading) return <LoadingSkeleton phrases={loadingPhrases} />;
  if (error)
    return (
      <ErrorState message={t("briefUnavailable")} onRetry={handleRefresh} />
    );
  if (!data) return null;

  const hasAnyContent =
    data.priorities.length > 0 ||
    data.suggestion !== null ||
    data.schedule.length > 0 ||
    data.risks.length > 0 ||
    data.opportunities.length > 0;

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A0E17]">

      {/* ── Opening ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-white/30">{getGreeting()}</p>
          <p className="mt-1 text-base font-medium leading-snug text-white/85">
            {data.opening}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label={t("briefRefresh")}
          className="mt-0.5 shrink-0 rounded-lg p-1.5 text-white/20 transition-colors hover:text-white/50 disabled:opacity-40"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── All clear (no content) ───────────────────────────────────────── */}
      {!hasAnyContent && (
        <>
          <Divider />
          <div className="px-6 py-5">
            <p className="text-sm text-white/30">{t("briefAllClear")}</p>
          </div>
        </>
      )}

      {/* ── Priorities ──────────────────────────────────────────────────── */}
      {data.priorities.length > 0 && (
        <>
          <Divider />
          <div className="px-6 py-5">
            <SectionLabel>{t("briefSectionPriorities")}</SectionLabel>
            <div className="space-y-3">
              {data.priorities.map((item, i) => (
                <Link key={i} href={item.href} className="group block">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-semibold text-violet-400">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white/85 transition-colors group-hover:text-white">
                        {item.action}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/35">
                        {item.why}
                      </p>
                    </div>
                    <ArrowRight
                      size={12}
                      className="mt-1 shrink-0 text-white/10 transition-colors group-hover:text-white/40"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Suggestion ──────────────────────────────────────────────────── */}
      {data.suggestion && (
        <>
          <Divider />
          <Link href={data.suggestion.href} className="group block px-6 py-5">
            <SectionLabel>{t("briefSectionSuggestion")}</SectionLabel>
            <p className="text-sm font-semibold text-violet-200/80 transition-colors group-hover:text-violet-100">
              {data.suggestion.action}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/35">
              {data.suggestion.why}
            </p>
          </Link>
        </>
      )}

      {/* ── Schedule ────────────────────────────────────────────────────── */}
      {data.schedule.length > 0 && (
        <>
          <Divider />
          <div className="px-6 py-5">
            <SectionLabel>{t("briefSectionSchedule")}</SectionLabel>
            <div className="space-y-2">
              {data.schedule.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.type === "meeting" ? (
                    <CalendarDays size={12} className="shrink-0 text-violet-400/50" />
                  ) : (
                    <Clock size={12} className="shrink-0 text-white/25" />
                  )}
                  <span className="flex-1 text-sm text-white/60">{item.text}</span>
                  {item.time && (
                    <span className="shrink-0 text-[11px] text-white/25">
                      {item.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Risks ───────────────────────────────────────────────────────── */}
      {data.risks.length > 0 && (
        <>
          <Divider />
          <div className="px-6 py-5">
            <SectionLabel>{t("briefSectionRisks")}</SectionLabel>
            <div className="space-y-2">
              {data.risks.map((risk, i) => (
                <Link
                  key={i}
                  href={risk.href}
                  className="group flex items-start gap-2.5 text-sm"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400/50 transition-colors group-hover:bg-amber-400" />
                  <span className="text-white/50 transition-colors group-hover:text-white/75">
                    {risk.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Opportunities ───────────────────────────────────────────────── */}
      {data.opportunities.length > 0 && (
        <>
          <Divider />
          <div className="px-6 py-5">
            <SectionLabel>{t("briefSectionOpportunities")}</SectionLabel>
            <div className="space-y-2">
              {data.opportunities.map((opp, i) => (
                <Link
                  key={i}
                  href={opp.href}
                  className="group flex items-start gap-2.5 text-sm"
                >
                  <TrendingUp
                    size={12}
                    className="mt-0.5 shrink-0 text-emerald-400/50 transition-colors group-hover:text-emerald-400"
                  />
                  <span className="text-white/50 transition-colors group-hover:text-white/75">
                    {opp.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Divider />
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/tasks"
            className="text-[11px] text-white/25 transition-colors hover:text-white/55"
          >
            {t("briefJumpTasks")}
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/dashboard/deals"
            className="text-[11px] text-white/25 transition-colors hover:text-white/55"
          >
            {t("briefJumpDeals")}
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/dashboard/calendar"
            className="text-[11px] text-white/25 transition-colors hover:text-white/55"
          >
            {t("briefJumpCalendar")}
          </Link>
        </div>

        {onOpenAI && (
          <button
            onClick={onOpenAI}
            className="text-[11px] text-white/20 transition-colors hover:text-white/50"
          >
            {t("briefAskGunimi")}
          </button>
        )}
      </div>
    </div>
  );
}
