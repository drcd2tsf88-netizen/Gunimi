"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mail, ExternalLink } from "lucide-react";
import { getEmailReplyUrl } from "@/lib/email/deepLink";
import EmailDetailSheet from "./EmailDetailSheet";
import type { UnansweredThread } from "@/server/actions/email/getUnansweredThreads";

type Props = {
  threads: UnansweredThread[];
};

function formatRelativeTime(dateStr: string | null, locale: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-days, "day");
  if (hours > 0) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-hours, "hour");
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-minutes, "minute");
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function NeedsReplySection({ threads }: Props) {
  const t = useTranslations("today");
  const locale = useLocale();
  const [selectedThread, setSelectedThread] = useState<UnansweredThread | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (threads.length === 0) return null;

  function openDetail(thread: UnansweredThread) {
    setSelectedThread(thread);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={11} className="text-amber-400/60" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium">
              {t("needsReplyTitle")}
              <span className="ml-1.5 text-zinc-700">{threads.length}</span>
            </span>
          </div>
          <Link
            href="/dashboard/email"
            className="text-[10px] text-zinc-600 transition-colors hover:text-zinc-400"
          >
            {t("needsReplySeeAll")}
          </Link>
        </div>

        <div className="space-y-1.5">
          {threads.map((thread) => {
            const senderLabel = thread.sender_name || thread.sender_email;
            const subject = thread.subject || t("needsReplyNoSubject");
            const replyUrl = getEmailReplyUrl(
              thread.provider,
              thread.provider_thread_id,
              thread.provider_account_email,
            );
            const timeAgo = formatRelativeTime(thread.last_message_at, locale);

            return (
              <div
                key={thread.id}
                onClick={() => openDetail(thread)}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] px-3 py-2.5 transition-colors hover:border-amber-500/20 hover:bg-amber-500/[0.06]"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                  <span className="text-[9px] font-semibold text-amber-300/70">
                    {getInitials(senderLabel)}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <p className="truncate text-xs font-medium text-white/75">
                      {senderLabel}
                    </p>
                    {timeAgo && (
                      <span className="shrink-0 text-[10px] text-white/25">{timeAgo}</span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-white/40">{subject}</p>
                  {thread.snippet && (
                    <p className="truncate text-[10px] text-white/25 mt-0.5">{thread.snippet}</p>
                  )}
                </div>

                {/* Reply button — opens web directly, doesn't open sheet */}
                <a
                  href={replyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="
                    flex shrink-0 items-center gap-1
                    rounded-lg border border-amber-500/20 bg-amber-500/10
                    px-2.5 py-1
                    text-[10px] font-medium text-amber-300/80
                    transition-all hover:border-amber-500/40 hover:bg-amber-500/20 hover:text-amber-200
                    opacity-0 group-hover:opacity-100
                  "
                >
                  {t("needsReplyButton")}
                  <ExternalLink size={9} className="opacity-60" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <EmailDetailSheet
        thread={selectedThread}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
