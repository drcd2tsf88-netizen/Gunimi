"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, User, Building2 } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { EmailThread } from "@/types/email";

type Props = {
  threads: EmailThread[];
};

export default function RecentEmailsWidget({ threads }: Props) {
  const t = useTranslations("dashboard");

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("recentEmails")}
          </p>
          <p className="mt-0.5 text-xs text-white/30">{t("statsEmails")}</p>
        </div>
        <Link
          href="/dashboard/email"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Mail className="h-6 w-6 text-white/20" />
            <p className="mt-3 text-sm font-medium text-white/60">{t("noEmails")}</p>
            <p className="mt-1 text-xs text-white/30">{t("noEmailsDescription")}</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.id}
              className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
            >
              {thread.has_unread && (
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              )}
              {!thread.has_unread && (
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/10" />
              )}

              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${thread.has_unread ? "font-semibold text-white" : "text-white/70"}`}>
                  {thread.subject ?? "(no subject)"}
                </p>
                {thread.snippet && (
                  <p className="mt-0.5 truncate text-[11px] text-white/30">{thread.snippet}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {thread.contact && (
                  <Link
                    href={`/dashboard/crm/${thread.contact.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] text-blue-300 transition-colors hover:border-blue-500/40 hover:bg-blue-500/20"
                  >
                    <User size={9} />
                    {thread.contact.name}
                  </Link>
                )}
                {thread.company && (
                  <Link
                    href={`/dashboard/companies/${thread.company.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] text-violet-300 transition-colors hover:border-violet-500/40 hover:bg-violet-500/20"
                  >
                    <Building2 size={9} />
                    {thread.company.name}
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </OrbitCard>
  );
}
