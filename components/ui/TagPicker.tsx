"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

import TagBadge from "@/components/ui/TagBadge";
import { TAG_COLORS, TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag, EntityType } from "@/types/tag";
import { addEntityTag } from "@/server/actions/tags/addEntityTag";
import { removeEntityTag } from "@/server/actions/tags/removeEntityTag";
import { createTag } from "@/server/actions/tags/createTag";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

type Props = {
  entityType: EntityType;
  entityId: string;
  allTags: WorkspaceTag[];
  initialTags: WorkspaceTag[];
};

export default function TagPicker({ entityType, entityId, allTags, initialTags }: Props) {
  const t = useTranslations("tags");
  const mounted = useIsHydrated();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<WorkspaceTag[]>(initialTags);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>("violet");
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const taggedIds = new Set(tags.map((t) => t.id));
  const available = allTags.filter((t) => !taggedIds.has(t.id));

  function openDropdown() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((p) => !p);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const portal = document.getElementById("tag-picker-portal");
      if (portal?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [open]);

  function handleAdd(tag: WorkspaceTag) {
    setTags((prev) => [...prev, tag]);
    startTransition(async () => {
      const ok = await addEntityTag(entityType, entityId, tag.id);
      if (!ok) setTags((prev) => prev.filter((t) => t.id !== tag.id));
    });
  }

  function handleRemove(tagId: string) {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    startTransition(async () => {
      const ok = await removeEntityTag(entityType, entityId, tagId);
      if (!ok) {
        const restored = allTags.find((t) => t.id === tagId);
        if (restored) setTags((prev) => [...prev, restored]);
      }
    });
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      const created = await createTag(name, newColor);
      if (created) {
        allTags.push(created);
        const ok = await addEntityTag(entityType, entityId, created.id);
        if (ok) {
          setTags((prev) => [...prev, created]);
        }
      }
      setNewName("");
      setNewColor("violet");
    });
  }

  const dropdown = open ? (
    <div
      id="tag-picker-portal"
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 100 }}
      className="w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1F]/95 shadow-2xl backdrop-blur-2xl"
    >
      {/* EXISTING TAGS */}
      {available.length > 0 && (
        <div className="border-b border-white/[0.06] p-2">
          <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
            {t("addTag")}
          </p>
          {available.map((tag) => {
            const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;
            return (
              <button
                key={tag.id}
                onClick={() => { handleAdd(tag); setOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <span className={`h-2 w-2 rounded-full ${colors.bg} ${colors.border} border`} />
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {/* CREATE NEW TAG */}
      <div className="p-3 space-y-2">
        <p className="px-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
          {t("createTag")}
        </p>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
          placeholder={t("tagNamePlaceholder")}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/40"
        />
        <div className="flex flex-wrap gap-1.5">
          {TAG_COLORS.map((c) => {
            const colors = TAG_COLOR_CLASSES[c];
            return (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={[
                  "h-5 w-5 rounded-full border-2 transition-all",
                  colors.bg,
                  newColor === c ? "border-white/60 scale-110" : "border-transparent opacity-50 hover:opacity-80",
                ].join(" ")}
                aria-label={c}
              />
            );
          })}
        </div>
        <button
          onClick={handleCreate}
          disabled={!newName.trim() || isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600/80 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-violet-600 disabled:opacity-40"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          {t("createTag")}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} onRemove={() => handleRemove(tag.id)} size="xs" />
      ))}

      <button
        ref={triggerRef}
        onClick={openDropdown}
        className="inline-flex h-5 items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-2 text-[10px] text-white/40 transition-all hover:border-white/20 hover:text-white/70"
      >
        <Plus size={9} />
        {t("addTag")}
      </button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
