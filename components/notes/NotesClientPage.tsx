"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Building2,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import TagBadge from "@/components/ui/TagBadge";
import TagHoverCard from "@/components/ui/TagHoverCard";
import EditNoteSheet from "@/components/notes/EditNoteSheet";
import CreateNoteSheet from "@/components/notes/CreateNoteSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { deleteNote } from "@/server/actions/notes/deleteNote";
import { extractTasksFromNote } from "@/server/actions/notes/extractTasksFromNote";
import type { WorkspaceNote } from "@/server/actions/notes/getWorkspaceNotes";
import type { WorkspaceTag } from "@/types/tag";

type Filter = "all" | "contacts" | "companies";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

type Props = {
  initialNotes: WorkspaceNote[];
  allTags: WorkspaceTag[];
  contactOptions: { id: string; name: string }[];
  companyOptions: { id: string; name: string }[];
};

type RowProps = {
  note: WorkspaceNote;
  extractingId: string | null;
  onEdit: (note: WorkspaceNote) => void;
  onDelete: (note: WorkspaceNote) => void;
  onExtract: (note: WorkspaceNote) => void;
};

function NoteRow({ note, extractingId, onEdit, onDelete, onExtract }: RowProps) {
  const t = useTranslations("notes");
  const tc = useTranslations("common");
  const isExtracting = extractingId === note.id;

  return (
    <div className="group flex items-start gap-4 border-l-2 border-l-violet-500/30 border-b border-b-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.025] last:border-b-0">
      {/* Icon */}
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
        <FileText size={12} className="text-violet-400" />
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/notes/${note.id}`}
            className="text-sm font-medium text-white/90 transition-colors hover:text-violet-300"
          >
            {note.title}
          </Link>

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

        {note.content && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600">
            {stripHtml(note.content)}
          </p>
        )}

        {note.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {note.tags.slice(0, 4).map((tag) => (
              <TagHoverCard key={tag.id} tag={tag}>
                <TagBadge tag={tag} size="xs" href={`/dashboard/tags/${tag.id}`} />
              </TagHoverCard>
            ))}
            {note.tags.length > 4 && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/30">
                +{note.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Date + hover actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-xs text-zinc-600">
          {new Date(note.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>

        <div className="flex items-center gap-1 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
          <button
            onClick={() => onEdit(note)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            title={tc("edit")}
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onExtract(note)}
            disabled={isExtracting}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-white/[0.06] hover:text-violet-300",
              isExtracting && "opacity-50 cursor-not-allowed",
            )}
            title={t("extractTasks")}
          >
            {isExtracting ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />}
          </button>
          <button
            onClick={() => onDelete(note)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-400"
            title={tc("delete")}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotesClientPage({
  initialNotes,
  allTags,
  contactOptions,
  companyOptions,
}: Props) {
  const t = useTranslations("notes");
  const tc = useTranslations("common");
  const router = useRouter();

  const [localNotes, setLocalNotes] = useState(initialNotes);
  const [prevNotes, setPrevNotes] = useState(initialNotes);
  if (prevNotes !== initialNotes) {
    setPrevNotes(initialNotes);
    setLocalNotes(initialNotes);
  }

  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [editNote, setEditNote] = useState<WorkspaceNote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceNote | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [extractingId, setExtractingId] = useState<string | null>(null);

  const filterButtons: { key: Filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "contacts", label: t("filterContacts") },
    { key: "companies", label: t("filterCompanies") },
  ];

  const filtered = useMemo(() => {
    let result = localNotes;
    if (filter === "contacts") result = result.filter((n) => n.contact_id);
    if (filter === "companies") result = result.filter((n) => n.company_id);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          stripHtml(n.content ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [localNotes, filter, search]);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const ok = await deleteNote(deleteTarget.id);
      if (ok) {
        toast.success(t("noteDeleted"));
        setLocalNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(t("failedToDeleteNote"));
      }
    });
  }

  async function handleExtract(note: WorkspaceNote) {
    if (!note.content?.trim()) { toast.error(t("noTasksFound")); return; }
    setExtractingId(note.id);
    try {
      const count = await extractTasksFromNote(note.id, note.content);
      if (count > 0) toast.success(t("tasksExtracted", { count }));
      else toast.error(t("noTasksFound"));
    } catch {
      toast.error(t("failedToExtract"));
    } finally {
      setExtractingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <GunimiSection>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <Search size={14} className="shrink-0 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-white/25 hover:text-white/60">×</button>
            )}
          </div>

          <div className="flex gap-1">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === btn.key
                    ? "bg-violet-600 text-white"
                    : "border border-white/[0.07] text-white/40 hover:border-white/15 hover:text-white/70",
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <GunimiButton onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            {t("newNote")}
          </GunimiButton>
        </div>
      </GunimiSection>

      {/* List */}
      <GunimiSection>
        {filtered.length === 0 ? (
          <GunimiEmptyState
            icon={FileText}
            title={t("noNotes")}
            description={t("noNotesDescription")}
            action={
              <GunimiButton onClick={() => setCreateOpen(true)}>
                <Plus size={14} />
                {t("newNote")}
              </GunimiButton>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080C14]">
            {filtered.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                extractingId={extractingId}
                onEdit={setEditNote}
                onDelete={setDeleteTarget}
                onExtract={handleExtract}
              />
            ))}
          </div>
        )}
      </GunimiSection>

      <CreateNoteSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        contactOptions={contactOptions}
        companyOptions={companyOptions}
      />

      {editNote && (
        <EditNoteSheet
          note={editNote}
          allTags={allTags}
          open={!!editNote}
          onOpenChange={(open) => { if (!open) setEditNote(null); }}
          onSaved={() => { setEditNote(null); router.refresh(); }}
        />
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteNote")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteNote")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
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
