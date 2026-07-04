"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import { motion } from "framer-motion";

import { FileText, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { getWorkspaceNotes } from "@/server/actions/notes/getWorkspaceNotes";
import { createNote } from "@/server/actions/notes/createNote";
import { deleteNote } from "@/server/actions/notes/deleteNote";

import OrbitCard from "@/components/ui/OrbitCard";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitTextarea from "@/components/ui/OrbitTextarea";
import OrbitSkeleton from "@/components/ui/OrbitSkeleton";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import OrbitButton from "@/components/ui/OrbitButton";
import OrbitSection from "@/components/layout/OrbitSection";
import EditNoteSheet from "@/components/notes/EditNoteSheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Note = {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  user_id: string;
};

export default function NotesPage() {
  const t = useTranslations("notes");
  const tc = useTranslations("common");

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [isDeleting, startDelete] = useTransition();

  async function loadNotes() {
    try {
      const data = await getWorkspaceNotes();
      setNotes(data);
    } catch {
      toast.error(t("failedToLoad"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }

    try {
      setCreating(true);

      const result = await createNote({ title: title.trim(), content: content.trim() });

      if (!result) {
        toast.error(t("failedToCreate"));
        return;
      }

      toast.success(t("noteCreated"));
      setTitle("");
      setContent("");
      await loadNotes();
    } catch {
      toast.error(t("failedToCreate"));
    } finally {
      setCreating(false);
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;

    startDelete(async () => {
      const ok = await deleteNote(deleteTarget.id);
      if (ok) {
        toast.success(t("noteDeleted"));
        setDeleteTarget(null);
        await loadNotes();
      } else {
        toast.error(t("failedToDeleteNote"));
      }
    });
  }

  useEffect(() => {
    async function init() {
      try {
        const data = await getWorkspaceNotes();
        setNotes(data);
      } catch {
        toast.error(t("failedToLoad"));
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [t]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <OrbitSection>
        <OrbitHeading badge={t("badge")} title={t("title")} subtitle={t("subtitle")} />
      </OrbitSection>

      {/* CREATE */}
      <OrbitSection>
        <OrbitCard className="p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-violet-300">
            <Sparkles size={12} />
            {t("newNote")}
          </div>

          <div className="mt-5 space-y-4">
            <OrbitInput
              type="text"
              placeholder={t("noteTitlePlaceholder")}
              value={title}
              disabled={creating}
              onChange={(e) => setTitle(e.target.value)}
            />

            <OrbitTextarea
              placeholder={t("writePlaceholder")}
              value={content}
              disabled={creating}
              onChange={(e) => setContent(e.target.value)}
            />

            <OrbitButton onClick={handleCreate} loading={creating}>
              <Plus size={14} />
              {t("createNote")}
            </OrbitButton>
          </div>
        </OrbitCard>
      </OrbitSection>

      {/* NOTES LIST */}
      <OrbitSection>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <OrbitSkeleton key={i} className="h-40" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <OrbitEmptyState
            icon={FileText}
            title={t("noNotes")}
            description={t("noNotesDescription")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <OrbitCard className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                      {note.title}
                    </h3>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/10 bg-violet-500/5 text-violet-300">
                      <FileText size={14} />
                    </div>
                  </div>

                  {note.content && (
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/50">
                      {note.content}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <p className="text-xs text-white/25">
                      {new Date(note.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <OrbitButton
                        variant="secondary"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => setEditNote(note)}
                      >
                        <Pencil size={12} />
                        {tc("edit")}
                      </OrbitButton>

                      <OrbitButton
                        variant="danger"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => setDeleteTarget(note)}
                      >
                        <Trash2 size={12} />
                        {tc("delete")}
                      </OrbitButton>
                    </div>
                  </div>
                </OrbitCard>
              </motion.div>
            ))}
          </div>
        )}
      </OrbitSection>

      {/* Edit sheet */}
      {editNote && (
        <EditNoteSheet
          note={editNote}
          open={!!editNote}
          onOpenChange={(open) => {
            if (!open) setEditNote(null);
          }}
          onSaved={loadNotes}
        />
      )}

      {/* Delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteNote")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteNote")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <OrbitButton
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            >
              {tc("cancel")}
            </OrbitButton>

            <OrbitButton variant="danger" loading={isDeleting} onClick={handleDeleteConfirm}>
              {tc("delete")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
