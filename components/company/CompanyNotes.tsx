"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiButton from "@/components/ui/GunimiButton";

import { createNote } from "@/server/actions/notes/createNote";
import type { CompanyNote } from "@/server/actions/company/getCompanyNotes";

type Props = {
  companyId: string;
  notes: CompanyNote[];
};

export default function CompanyNotes({ companyId, notes }: Props) {
  const t = useTranslations("companies");
  const [localNotes, setLocalNotes] = useState(notes);
  const [title, setTitle] = useState("");
  const [isPending, startCreate] = useTransition();

  function handleCreate() {
    if (!title.trim()) return;
    const optimisticTitle = title.trim();
    setTitle("");
    startCreate(async () => {
      const result = await createNote({ title: optimisticTitle, companyId });
      if (result) {
        setLocalNotes((prev) => [
          { id: result.id, title: result.title, content: result.content ?? null, created_at: result.created_at },
          ...prev,
        ]);
        toast.success(t("noteCreated"));
      } else {
        toast.error(t("noteCreateFailed"));
        setTitle(optimisticTitle);
      }
    });
  }

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {t("notesTitle")}
      </p>

      {/* Inline create form */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <GunimiInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("noteTitlePlaceholder")}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            className="h-8 text-xs"
          />
        </div>
        <GunimiButton
          onClick={handleCreate}
          disabled={!title.trim() || isPending}
          loading={isPending}
          className="shrink-0 gap-1 px-2.5 py-1.5 text-xs"
        >
          <Plus size={11} />
          {t("addNote")}
        </GunimiButton>
      </div>

      {localNotes.length === 0 ? (
        <GunimiEmptyState
          title={t("noNotes")}
          description={t("noNotesDescription")}
          icon={FileText}
        />
      ) : (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06]">
          {localNotes.map((note, i) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className={[
                "flex items-center gap-2.5 px-3 py-1.5 transition-colors hover:bg-white/[0.025]",
                i !== 0 ? "border-t border-white/[0.04]" : "",
              ].join(" ")}
            >
              <FileText size={10} className="shrink-0 text-white/25" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-white/80">{note.title}</p>
                {note.content && (
                  <p className="truncate text-[10px] text-white/35">{note.content}</p>
                )}
              </div>
              <p className="shrink-0 whitespace-nowrap text-[10px] text-white/25">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
