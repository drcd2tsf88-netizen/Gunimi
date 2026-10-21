"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink, Mail, User, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getThreadMessages } from "@/server/actions/email/getThreadMessages";
import { getEmailReplyUrl } from "@/lib/email/deepLink";
import type { UnansweredThread } from "@/server/actions/email/getUnansweredThreads";
import type { ThreadMessage } from "@/server/actions/email/getThreadMessages";

type Props = {
  thread: UnansweredThread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatTime(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmailDetailSheet({ thread, open, onOpenChange }: Props) {
  const t = useTranslations("today");
  const locale = useLocale();
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !thread) {
      setMessages([]);
      return;
    }
    setLoading(true);
    getThreadMessages(thread.id).then((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
  }, [open, thread?.id]);

  if (!thread) return null;

  const lastInbound = [...messages].reverse().find((m) => !m.isOutbound) ?? null;
  const replyUrl = getEmailReplyUrl(
    thread.provider,
    thread.provider_thread_id,
    thread.provider_account_email,
  );
  const subject = thread.subject ?? t("needsReplyNoSubject");
  const senderLabel = thread.sender_name || thread.sender_email;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full max-w-lg flex-col gap-0 bg-[#07090F] p-0">
        {/* Header */}
        <SheetHeader className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
              <Mail size={14} className="text-amber-400" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-sm font-semibold text-white/90">
                {subject}
              </SheetTitle>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{senderLabel}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Contact / Company quick links */}
        {(thread.contact || thread.company) && (
          <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-2.5">
            {thread.contact && (
              <Link
                href={`/dashboard/contacts/${thread.contact.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-violet-300"
              >
                <User size={10} />
                {thread.contact.name}
              </Link>
            )}
            {thread.contact && thread.company && (
              <span className="text-zinc-700">·</span>
            )}
            {thread.company && (
              <Link
                href={`/dashboard/companies/${thread.company.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-violet-300"
              >
                <Building2 size={10} />
                {thread.company.name}
              </Link>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={18} className="animate-spin text-zinc-600" />
            </div>
          ) : lastInbound ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-xs font-medium text-white/60">
                  {lastInbound.senderName ?? lastInbound.senderEmail}
                </p>
                <p className="shrink-0 text-[11px] text-zinc-600">
                  {formatTime(lastInbound.sentAt, locale)}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {lastInbound.body
                  ? stripHtml(lastInbound.body)
                  : (thread.snippet ?? t("needsReplySheetNoContent"))}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-600">
              {thread.snippet ?? t("needsReplySheetNoContent")}
            </p>
          )}
        </div>

        {/* Footer — Reply CTA */}
        <div className="border-t border-white/[0.06] px-5 py-4">
          <a
            href={replyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/15 py-3 text-sm font-semibold text-amber-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/25"
          >
            {t("needsReplyButton")}
            <ExternalLink size={13} />
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
