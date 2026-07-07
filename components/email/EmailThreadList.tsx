"use client";

import { useTranslations } from "next-intl";
import { Building2, Mail, User } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";
import type { EmailThread } from "@/types/email";

type Props = {
  threads: EmailThread[];
};

function formatDate(ts: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return d.toLocaleDateString(undefined, { weekday: "short" });
  }

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getSenderDisplay(thread: EmailThread): string {
  if (thread.contact?.name) return thread.contact.name;
  const first = thread.participant_emails[0];
  return first ?? "Unknown";
}

export default function EmailThreadList({ threads }: Props) {
  const t = useTranslations("email");

  if (threads.length === 0) {
    return (
      <GunimiCard className="p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Mail size={22} className="text-zinc-600" />
          <p className="text-sm text-white/40">{t("noThreads")}</p>
        </div>
      </GunimiCard>
    );
  }

  return (
    <div className="space-y-px overflow-hidden rounded-xl border border-white/[0.06]">
      {threads.map((thread, index) => (
        <div
          key={thread.id}
          className={[
            "flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]",
            index !== threads.length - 1 ? "border-b border-white/[0.04]" : "",
          ].join(" ")}
        >
          {/* Unread indicator */}
          <div className="mt-1.5 shrink-0">
            <div
              className={[
                "h-2 w-2 rounded-full",
                thread.has_unread ? "bg-blue-400" : "bg-transparent",
              ].join(" ")}
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p
                className={[
                  "truncate text-sm",
                  thread.has_unread ? "font-semibold text-white" : "font-normal text-white/60",
                ].join(" ")}
              >
                {getSenderDisplay(thread)}
              </p>
              <span className="shrink-0 text-xs text-white/25">
                {formatDate(thread.last_message_at)}
              </span>
            </div>

            <p
              className={[
                "mt-0.5 truncate text-xs",
                thread.has_unread ? "text-white/80" : "text-white/40",
              ].join(" ")}
            >
              {thread.subject ?? t("noSubject")}
            </p>

            {thread.snippet && (
              <p className="mt-0.5 truncate text-xs text-white/25">{thread.snippet}</p>
            )}

            {/* CRM badges */}
            {(thread.contact || thread.company) && (
              <div className="mt-2 flex items-center gap-2">
                {thread.contact && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                    <User size={9} />
                    {thread.contact.name}
                  </span>
                )}
                {thread.company && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
                    <Building2 size={9} />
                    {thread.company.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Message count */}
          {thread.message_count > 1 && (
            <span className="mt-1 shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] tabular-nums text-white/30">
              {thread.message_count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
