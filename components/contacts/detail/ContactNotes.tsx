"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import { Contact } from "@/types/contact";
import { ContactNote } from "@/server/actions/crm/getContactNotes";

type Props = {
  contact: Contact;
  notes: ContactNote[];
};

export default function ContactNotes({ contact, notes }: Props) {
  const t = useTranslations("contacts");

  const hasInlineNotes = !!contact.notes?.trim();
  const hasNotes = hasInlineNotes || notes.length > 0;

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("notesBadge")}
        title={t("notes")}
        subtitle={t("notesSubtitle")}
      />

      {!hasNotes ? (
        <OrbitEmptyState
          title={t("noNotes")}
          description={t("noNotesDescription")}
          icon={FileText}
        />
      ) : (
        <div className="mt-6 space-y-3">
          {hasInlineNotes && (
            <OrbitCard className="p-5">
              <div className="flex items-start gap-3">
                <FileText size={15} className="mt-0.5 shrink-0 text-zinc-500" />
                <p className="text-sm leading-relaxed text-white/70">
                  {contact.notes}
                </p>
              </div>
            </OrbitCard>
          )}

          {notes.map((note) => (
            <OrbitCard key={note.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium">{note.title}</h3>
                  {note.content && (
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
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
