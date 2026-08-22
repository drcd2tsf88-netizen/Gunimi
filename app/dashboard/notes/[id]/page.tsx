import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getNote } from "@/server/actions/notes/getNote";
import { getTags } from "@/server/actions/tags/getTags";
import NoteDetailClient from "@/components/notes/NoteDetailClient";

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
  const [note, allTags] = await Promise.all([getNote(id), getTags()]);

  if (!note) notFound();

  return <NoteDetailClient note={note} allTags={allTags} />;
}
