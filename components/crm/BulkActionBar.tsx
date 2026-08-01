"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Download, Tag, Trash2, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { bulkDeleteContacts } from "@/server/actions/crm/bulkDeleteContacts";
import { bulkAssignTag } from "@/server/actions/tags/bulkAssignTag";
import type { WorkspaceTag } from "@/types/tag";

type Props = {
  selectedIds: string[];
  selectedContacts: { id: string; name: string; email?: string | null; position?: string | null; companies?: { name: string } | null }[];
  tags: WorkspaceTag[];
  onClear: () => void;
  onDeleted: (ids: string[]) => void;
};

function exportContactsCSV(
  contacts: Props["selectedContacts"]
) {
  const header = ["Name", "Email", "Position", "Company"];
  const rows = contacts.map((c) => [
    c.name ?? "",
    c.email ?? "",
    c.position ?? "",
    c.companies?.name ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `contacts_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkActionBar({ selectedIds, selectedContacts, tags, onClear, onDeleted }: Props) {
  const t = useTranslations("crm");
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [isTagging, startTag] = useTransition();

  if (!selectedIds.length) return null;

  function handleExport() {
    exportContactsCSV(selectedContacts);
  }

  function handleAssignTag(tagId: string) {
    setTagPickerOpen(false);
    startTag(async () => {
      const result = await bulkAssignTag("contact", selectedIds, tagId);
      if (result.assigned > 0) {
        toast.success(t("bulkTagAssigned", { count: result.assigned }));
      } else {
        toast.error(t("bulkTagFailed"));
      }
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startDelete(async () => {
      const result = await bulkDeleteContacts(selectedIds);
      if (result.deleted > 0) {
        toast.success(t("bulkDeleted", { count: result.deleted }));
        onDeleted(selectedIds);
        onClear();
      } else {
        toast.error(t("bulkDeleteFailed"));
      }
      setConfirmDelete(false);
    });
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-zinc-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md">
        {/* Count */}
        <span className="mr-1 rounded-lg bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300">
          {t("bulkSelected", { count: selectedIds.length })}
        </span>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/90"
        >
          <Download size={12} />
          {t("bulkExport")}
        </button>

        {/* Assign tag */}
        <div className="relative">
          <button
            onClick={() => { setTagPickerOpen((v) => !v); setConfirmDelete(false); }}
            disabled={isTagging}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/90 disabled:opacity-40"
          >
            <Tag size={12} />
            {t("bulkAssignTag")}
            <ChevronDown size={10} />
          </button>

          {tagPickerOpen && (
            <div className="absolute bottom-full mb-2 left-0 min-w-[180px] rounded-xl border border-white/[0.08] bg-zinc-900 p-1 shadow-xl">
              {tags.length === 0 ? (
                <p className="px-3 py-2 text-xs text-white/30">{t("bulkPickTag")}</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleAssignTag(tag.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white/90"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: tag.color ?? "#6d28d9" }}
                    />
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-1 h-4 w-px bg-white/[0.08]" />

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
            confirmDelete
              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
              : "text-white/40 hover:bg-red-500/10 hover:text-red-400"
          }`}
        >
          <Trash2 size={12} />
          {confirmDelete
            ? t("bulkDeleteConfirm", { count: selectedIds.length })
            : t("bulkDelete")}
        </button>

        {/* Clear */}
        <button
          onClick={() => { onClear(); setConfirmDelete(false); setTagPickerOpen(false); }}
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/60"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
}
