"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Building2, FileText, Pencil, Save, User, X } from "lucide-react";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import TagPicker from "@/components/ui/TagPicker";
import NoteEditor from "@/components/notes/NoteEditor";

import { updateNote } from "@/server/actions/notes/updateNote";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import type { NoteDetail } from "@/server/actions/notes/getNote";
import type { WorkspaceTag } from "@/types/tag";

type Props = {
  note: NoteDetail;
  allTags: WorkspaceTag[];
};

export default function NoteDetailClient({ note, allTags }: Props) {
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
      <div className="space-y-4">
        {/* Back */}
        <Link
          href="/dashboard/notes"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft size={12} />
          {t("backToNotes")}
        </Link>

        {/* Compact identity strip */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080C14] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">

          {/* Left — icon + info */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <FileText size={20} className="text-violet-300" />
            </div>

            <div className="min-w-0 space-y-1.5">
              {editing ? (
                <GunimiInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("noteTitlePlaceholder")}
                  className="text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <h1 className="text-lg font-semibold leading-tight text-white">{note.title}</h1>
              )}

              <p className="text-xs text-zinc-600">
                {new Date(note.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Entity chips */}
              {(note.contactName || note.companyName) && (
                <div className="flex flex-wrap items-center gap-2">
                  {note.contactName && note.contact_id && (
                    <Link
                      href={`/dashboard/contacts/${note.contact_id}`}
                      className="flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] text-cyan-300 transition-colors hover:border-cyan-500/40"
                    >
                      <User size={10} />
                      {note.contactName}
                    </Link>
                  )}
                  {note.companyName && note.company_id && (
                    <Link
                      href={`/dashboard/companies/${note.company_id}`}
                      className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] text-blue-300 transition-colors hover:border-blue-500/40"
                    >
                      <Building2 size={10} />
                      {note.companyName}
                    </Link>
                  )}
                </div>
              )}

              {/* Tags */}
              <TagPicker
                entityType="note"
                entityId={note.id}
                allTags={allTags}
                initialTags={note.tags}
              />
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
            {editing ? (
              <>
                <GunimiButton
                  variant="secondary"
                  className="h-8 gap-1.5 px-3 text-xs"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  <X size={12} />
                  {tc("cancel")}
                </GunimiButton>
                <GunimiButton
                  className="h-8 gap-1.5 px-3 text-xs"
                  onClick={handleSave}
                  loading={isPending}
                  disabled={!title.trim() || isPending}
                >
                  <Save size={12} />
                  {tc("save")}
                </GunimiButton>
              </>
            ) : (
              <GunimiButton
                variant="secondary"
                className="h-8 gap-1.5 px-3 text-xs"
                onClick={handleEdit}
              >
                <Pencil size={12} />
                {tc("edit")}
              </GunimiButton>
            )}
          </div>
        </div>

        {/* Content */}
        <GunimiCard className="p-6">
          {editing ? (
            <NoteEditor
              content={content}
              onChange={setContent}
              placeholder={t("writePlaceholder")}
              minHeight="200px"
            />
          ) : note.content ? (
            <div className="note-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }} />
          ) : (
            <p className="text-sm italic text-white/25">{t("writePlaceholder")}</p>
          )}
        </GunimiCard>
      </div>
    </GunimiSection>
  );
}
