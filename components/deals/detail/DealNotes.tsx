"use client";

import Link from "next/link";
import { FileText, User, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import type { DealRelatedNote } from "@/server/actions/deals/getDealRelatedNotes";

type Props = {
  notes: DealRelatedNote[];
  contactId?: string | null;
  companyId?: string | null;
};

export default function DealNotes({ notes, contactId, companyId }: Props) {
  const t = useTranslations("deals");

  return (
    <GunimiSection>
      <GunimiHeading
        badge={t("relatedNotesBadge")}
        title={t("relatedNotes")}
        subtitle={t("relatedNotesSubtitle")}
      />

      {notes.length === 0 ? (
        <GunimiEmptyState
          title={t("noRelatedNotes")}
          description={t("noRelatedNotesDescription")}
          icon={FileText}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {contactId && (
                <Link
                  href={`/dashboard/contacts/${contactId}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/[0.14] hover:text-white/75"
                >
                  <User size={11} />
                  {t("goToContact")}
                </Link>
              )}
              {companyId && (
                <Link
                  href={`/dashboard/companies/${companyId}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/[0.14] hover:text-white/75"
                >
                  <Building2 size={11} />
                  {t("goToCompany")}
                </Link>
              )}
            </div>
          }
        />
      ) : (
        <div className="mt-6 space-y-3">
          {notes.map((note) => (
            <GunimiCard key={note.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {note.source === "contact" ? (
                      <User size={11} className="shrink-0 text-cyan-400/60" />
                    ) : (
                      <Building2 size={11} className="shrink-0 text-violet-400/60" />
                    )}
                    <h3 className="truncate text-sm font-medium text-white/85">{note.title}</h3>
                  </div>
                  {note.content && (
                    <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-3">
                      {note.content}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="whitespace-nowrap text-xs text-white/30">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                  <span
                    className={`rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wide ${
                      note.source === "contact"
                        ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                        : "border-violet-500/20 bg-violet-500/10 text-violet-400"
                    }`}
                  >
                    {note.source}
                  </span>
                </div>
              </div>
            </GunimiCard>
          ))}
        </div>
      )}
    </GunimiSection>
  );
}
