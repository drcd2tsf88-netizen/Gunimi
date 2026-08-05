"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Pencil, Save, X } from "lucide-react";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import TagBadge from "@/components/ui/TagBadge";
import NoteEditor from "@/components/notes/NoteEditor";

import { updateNote } from "@/server/actions/notes/updateNote";
import type { NoteDetail } from "@/server/actions/notes/getNote";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

type Props = {
  note: NoteDetail;
};


export default function NoteDetailClient({ note }: Props) {
  const t = useTranslations("notes");
  const tc = useTranslations("common");
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");
  const [isPending, startSave] = useTransition();

  function handleEdit() {
    setTitle(note.title);
    setContent(note.content ?? "");
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleSave() {
    if (!title.trim()) return;
    startSave(async () => {
      const result = await updateNote({ noteId: note.id, title: title.trim(), content });
      if (result) {
        toast.success(t("noteUpdated"));
        setEditing(false);
        router.refresh();
      } else {
        toast.error(t("failedToUpdateNote"));
      }
    });
  }

  return (
    <GunimiSection>
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("badge")}
          title={editing ? title : note.title}
          subtitle={new Date(note.created_at).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        />

        <div className="flex shrink-0 items-center gap-2 pt-1">
          {editing ? (
            <>
              <GunimiButton
                variant="secondary"
                onClick={handleCancel}
                className="gap-1.5 px-3 py-2 text-xs"
              >
                <X size={12} />
                {tc("cancel")}
              </GunimiButton>
              <GunimiButton
                onClick={handleSave}
                loading={isPending}
                disabled={!title.trim() || isPending}
                className="gap-1.5 px-3 py-2 text-xs"
              >
                <Save size={12} />
                {tc("save")}
              </GunimiButton>
            </>
          ) : (
            <GunimiButton
              variant="secondary"
              onClick={handleEdit}
              className="gap-1.5 px-3 py-2 text-xs"
            >
              <Pencil size={12} />
              {tc("edit")}
            </GunimiButton>
          )}
        </div>
      </div>

      <GunimiCard className="mt-4 p-6">
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                {t("noteTitlePlaceholder")}
              </label>
              <GunimiInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("noteTitlePlaceholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                {t("noteContentLabel")}
              </label>
              <NoteEditor
                content={content}
                onChange={setContent}
                placeholder={t("writePlaceholder")}
                minHeight="200px"
              />
            </div>
          </div>
        ) : note.content ? (
          <div className="note-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }} />
        ) : (
          <p className="text-sm italic text-white/25">{t("writePlaceholder")}</p>
        )}
      </GunimiCard>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} size="sm" href={`/dashboard/tags/${tag.id}`} />
          ))}
        </div>
      )}
    </GunimiSection>
  );
}
