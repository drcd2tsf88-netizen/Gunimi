import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, Building2, User } from "lucide-react";
import { getNote } from "@/server/actions/notes/getNote";
import NoteDetailClient from "@/components/notes/NoteDetailClient";
import GunimiSection from "@/components/layout/GunimiSection";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  const t = await getTranslations("notes");
  return { title: note?.title ?? t("noteNotFound") };
}

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  const t = await getTranslations("notes");

  if (!note) notFound();

  return (
    <div className="space-y-6">
      {/* Back */}
      <GunimiSection>
        <Link
          href="/dashboard/notes"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft size={13} />
          {t("backToNotes")}
        </Link>
      </GunimiSection>

      {/* Entity chips */}
      {(note.contactName || note.companyName) && (
        <GunimiSection>
          <div className="flex flex-wrap gap-2">
            {note.contactName && (
              <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                <User size={11} />
                {note.contactName}
              </span>
            )}
            {note.companyName && (
              <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                <Building2 size={11} />
                {note.companyName}
              </span>
            )}
          </div>
        </GunimiSection>
      )}

      <NoteDetailClient note={note} />
    </div>
  );
}
