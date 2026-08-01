"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import toast from "react-hot-toast";

import { TAG_COLORS, TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag } from "@/types/tag";
import { createTag } from "@/server/actions/tags/createTag";
import { updateTag } from "@/server/actions/tags/updateTag";
import { deleteTag } from "@/server/actions/tags/deleteTag";
import TagBadge from "@/components/ui/TagBadge";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import { Tag } from "lucide-react";

type Props = { initialTags: WorkspaceTag[] };

type EditState = { id: string; name: string; color: string } | null;

export default function TagsSection({ initialTags }: Props) {
  const t = useTranslations("tags");
  const [tags, setTags] = useState<WorkspaceTag[]>(initialTags);
  const [isPending, startTransition] = useTransition();

  // Create form
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("violet");
  const [showCreate, setShowCreate] = useState(false);

  // Edit state
  const [editing, setEditing] = useState<EditState>(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      const created = await createTag(name, newColor);
      if (created) {
        setTags((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        setNewName("");
        setNewColor("violet");
        setShowCreate(false);
        toast.success(t("tagCreated"));
      } else {
        toast.error(t("tagCreateFailed"));
      }
    });
  }

  function handleUpdate() {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return;
    startTransition(async () => {
      const ok = await updateTag(editing.id, name, editing.color);
      if (ok) {
        setTags((prev) =>
          prev
            .map((tg) => (tg.id === editing.id ? { ...tg, name, color: editing.color } : tg))
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        setEditing(null);
        toast.success(t("tagUpdated"));
      } else {
        toast.error(t("tagUpdateFailed"));
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const ok = await deleteTag(id);
      if (ok) {
        setTags((prev) => prev.filter((tg) => tg.id !== id));
        setDeleteId(null);
        toast.success(t("tagDeleted"));
      } else {
        toast.error(t("tagDeleteFailed"));
        setDeleteId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{t("settingsTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("settingsSubtitle")}</p>
        </div>
        <GunimiButton
          variant="secondary"
          className="gap-1.5 px-3 py-2 text-xs"
          onClick={() => { setShowCreate((p) => !p); setEditing(null); }}
        >
          <Plus size={13} />
          {t("newTag")}
        </GunimiButton>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-white/60">{t("createTag")}</p>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowCreate(false); }}
            placeholder={t("tagNamePlaceholder")}
            autoFocus
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/40"
          />
          <div className="flex flex-wrap gap-2">
            {TAG_COLORS.map((c) => {
              const cls = TAG_COLOR_CLASSES[c];
              return (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={[
                    "h-6 w-6 rounded-full border-2 transition-all",
                    cls.bg,
                    newColor === c ? "border-white/70 scale-110" : "border-transparent opacity-40 hover:opacity-70",
                  ].join(" ")}
                  title={c}
                />
              );
            })}
          </div>
          <div className="flex gap-2">
            <GunimiButton
              variant="primary"
              className="gap-1.5 px-3 py-2 text-xs"
              loading={isPending}
              disabled={!newName.trim()}
              onClick={handleCreate}
            >
              <Check size={12} />
              {t("saveTag")}
            </GunimiButton>
            <GunimiButton
              variant="secondary"
              className="gap-1.5 px-3 py-2 text-xs"
              onClick={() => setShowCreate(false)}
            >
              <X size={12} />
              {t("cancel")}
            </GunimiButton>
          </div>
        </div>
      )}

      {/* TAG LIST */}
      {tags.length === 0 ? (
        <GunimiEmptyState
          icon={Tag}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="space-y-1 overflow-hidden rounded-2xl border border-white/[0.06]">
          {tags.map((tag, i) => (
            <div
              key={tag.id}
              className={[
                "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]",
                i !== 0 ? "border-t border-white/[0.04]" : "",
              ].join(" ")}
            >
              {editing?.id === tag.id ? (
                /* EDIT ROW */
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") setEditing(null); }}
                    autoFocus
                    className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-sm text-white outline-none focus:border-violet-500/40"
                  />
                  <div className="flex gap-1.5">
                    {TAG_COLORS.map((c) => {
                      const cls = TAG_COLOR_CLASSES[c];
                      return (
                        <button
                          key={c}
                          onClick={() => setEditing({ ...editing, color: c })}
                          className={[
                            "h-5 w-5 rounded-full border-2 transition-all",
                            cls.bg,
                            editing.color === c ? "border-white/70 scale-110" : "border-transparent opacity-40 hover:opacity-70",
                          ].join(" ")}
                          title={c}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleUpdate}
                      disabled={isPending}
                      className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : deleteId === tag.id ? (
                /* DELETE CONFIRM ROW */
                <div className="flex flex-1 items-center justify-between gap-3">
                  <p className="text-sm text-white/60">{t("deleteConfirm")} <span className="font-medium text-white">{tag.name}</span>?</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDelete(tag.id)}
                      disabled={isPending}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition-colors hover:bg-rose-500/20"
                    >
                      {t("delete")}
                    </button>
                    <button
                      onClick={() => setDeleteId(null)}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                /* NORMAL ROW */
                <>
                  <div className="flex-1">
                    <TagBadge tag={tag} href={`/dashboard/tags/${tag.id}`} />
                  </div>
                  <div className="flex shrink-0 gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 [.group:hover_&]:opacity-100">
                    <button
                      onClick={() => { setEditing({ id: tag.id, name: tag.name, color: tag.color }); setShowCreate(false); }}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(tag.id)}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
