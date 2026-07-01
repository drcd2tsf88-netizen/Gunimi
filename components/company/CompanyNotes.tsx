"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";

import type { CompanyNote } from "@/server/actions/company/getCompanyNotes";

type Props = {
  notes: CompanyNote[];
};

export default function CompanyNotes({ notes }: Props) {
  const t = useTranslations("companies");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("notesBadge")}
        title={t("notesTitle")}
        subtitle={t("notesSubtitle")}
      />

      {notes.length === 0 ? (
        <OrbitEmptyState
          title={t("noNotes")}
          description={t("noNotesDescription")}
          icon={FileText}
        />
      ) : (
        <div className="mt-6 space-y-3">
          {notes.map((note) => (
            <OrbitCard key={note.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="shrink-0 text-white/30" />
                    <h3 className="truncate text-sm font-medium text-white/85">{note.title}</h3>
                  </div>
                  {note.content && (
                    <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-3">
                      {note.content}
                    </p>
                  )}
                </div>
                <p className="shrink-0 whitespace-nowrap text-xs text-white/30">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            </OrbitCard>
          ))}
        </div>
      )}
    </OrbitSection>
  );
}
