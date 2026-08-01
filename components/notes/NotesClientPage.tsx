"use client";

import {
  useEffect,
  useState,
  useTransition,
  useMemo,
} from "react";

import { motion } from "framer-motion";

import {
  FileText,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Search,
  Building2,
  User,
  Loader2,
  Wand2,
} from "lucide-react";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { getWorkspaceNotes, type WorkspaceNote } from "@/server/actions/notes/getWorkspaceNotes";
import { createNote } from "@/server/actions/notes/createNote";
import { deleteNote } from "@/server/actions/notes/deleteNote";
import { extractTasksFromNote } from "@/server/actions/notes/extractTasksFromNote";
import { getTags } from "@/server/actions/tags/getTags";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiSkeleton from "@/components/ui/GunimiSkeleton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiSection from "@/components/layout/GunimiSection";
import TagBadge from "@/components/ui/TagBadge";
import NoteEditor from "@/components/notes/NoteEditor";
import EditNoteSheet from "@/components/notes/EditNoteSheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import type { WorkspaceTag } from "@/types/tag";

type Filter = "all" | "contacts" | "companies";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function NotesClientPage() {
  const t = useTranslations("notes");
  const tc = useTranslations("common");

  const [notes, setNotes] = useState<WorkspaceNote[]>([]);
  const [allTags, setAllTags] = useState<WorkspaceTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [editNote, setEditNote] = useState<WorkspaceNote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceNote | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [, startLoad] = useTransition();

  const [extractingId, setExtractingId] = useState<string | null>(null);

  async function loadNotes() {
    try {
      const [data, tags] = await Promise.all([getWorkspaceNotes(), getTags()]);
      setNotes(data);
      setAllTags(tags);
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

  async function handleExtract(note: WorkspaceNote) {
    if (!note.content?.trim()) {
      toast.error(t("noTasksFound"));
      return;
    }

    setExtractingId(note.id);
    try {
      const count = await extractTasksFromNote(note.id, note.content);
      if (count > 0) {
        toast.success(t("tasksExtracted", { count }));
      } else {
        toast.error(t("noTasksFound"));
      }
    } catch {
      toast.error(t("failedToExtract"));
    } finally {
      setExtractingId(null);
    }
  }

  useEffect(() => {
    startLoad(async () => {
      await loadNotes();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = notes;

    if (filter === "contacts") result = result.filter((n) => n.contact_id);
    if (filter === "companies") result = result.filter((n) => n.company_id);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          stripHtml(n.content ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [notes, filter, search]);

  const filterButtons: { key: Filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "contacts", label: t("filterContacts") },
    { key: "companies", label: t("filterCompanies") },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <GunimiSection>
        <GunimiHeading badge={t("badge")} title={t("title")} subtitle={t("subtitle")} />
      </GunimiSection>

      {/* CREATE */}
      <GunimiSection>
        <GunimiCard className="p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-violet-300">
            <Sparkles size={12} />
            {t("newNote")}
          </div>

          <div className="mt-5 space-y-4">
            <GunimiInput
              type="text"
              placeholder={t("noteTitlePlaceholder")}
              value={title}
              disabled={creating}
              onChange={(e) => setTitle(e.target.value)}
            />

            <NoteEditor
              content={content}
              onChange={setContent}
              placeholder={t("writePlaceholder")}
              disabled={creating}
            />

            <GunimiButton onClick={handleCreate} loading={creating}>
              <Plus size={14} />
              {t("createNote")}
            </GunimiButton>
          </div>
        </GunimiCard>
      </GunimiSection>

      {/* SEARCH + FILTER */}
      <GunimiSection>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-white/80 placeholder-white/25 outline-none transition-colors focus:border-violet-500/40"
            />
          </div>

          <div className="flex gap-1">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === btn.key
                    ? "bg-violet-600 text-white"
                    : "border border-white/[0.07] text-white/40 hover:border-white/15 hover:text-white/70"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </GunimiSection>

      {/* NOTES LIST */}
      <GunimiSection>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <GunimiSkeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <GunimiEmptyState
            icon={FileText}
            title={t("noNotes")}
            description={t("noNotesDescription")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <GunimiCard className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                      {note.title}
                    </h3>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/10 bg-violet-500/5 text-violet-300">
                      <FileText size={14} />
                    </div>
                  </div>

                  {/* Entity chips */}
                  {(note.contactName || note.companyName) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {note.contactName && (
                        <span className="flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                          <User size={9} />
                          {note.contactName}
                        </span>
                      )}
                      {note.companyName && (
                        <span className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                          <Building2 size={9} />
                          {note.companyName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content preview (strip HTML for plain text display) */}
                  {note.content && (
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/50">
                      {stripHtml(note.content)}
                    </p>
                  )}

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.slice(0, 4).map((tag) => (
                        <TagBadge key={tag.id} tag={tag} size="xs" />
                      ))}
                      {note.tags.length > 4 && (
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/30">
                          +{note.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <p className="text-xs text-white/25">
                      {new Date(note.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <GunimiButton
                        variant="secondary"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => setEditNote(note)}
                      >
                        <Pencil size={12} />
                        {tc("edit")}
                      </GunimiButton>

                      <GunimiButton
                        variant="secondary"
                        className="h-8 gap-1.5 px-3 text-xs"
                        disabled={extractingId === note.id}
                        onClick={() => handleExtract(note)}
                      >
                        {extractingId === note.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Wand2 size={12} />
                        )}
                        {extractingId === note.id ? t("extracting") : t("extractTasks")}
                      </GunimiButton>

                      <GunimiButton
                        variant="danger"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => setDeleteTarget(note)}
                      >
                        <Trash2 size={12} />
                        {tc("delete")}
                      </GunimiButton>
                    </div>
                  </div>
                </GunimiCard>
              </motion.div>
            ))}
          </div>
        )}
      </GunimiSection>

      {/* Edit sheet */}
      {editNote && (
        <EditNoteSheet
          note={editNote}
          allTags={allTags}
          open={!!editNote}
          onOpenChange={(open) => {
            if (!open) setEditNote(null);
          }}
          onSaved={() => { void loadNotes(); }}
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
            <GunimiButton
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            >
              {tc("cancel")}
            </GunimiButton>

            <GunimiButton variant="danger" loading={isDeleting} onClick={handleDeleteConfirm}>
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
