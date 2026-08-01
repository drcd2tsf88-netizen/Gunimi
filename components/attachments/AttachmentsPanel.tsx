"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Paperclip,
  Upload,
  Trash2,
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  File,
} from "lucide-react";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiButton from "@/components/ui/GunimiButton";

import { uploadAttachment } from "@/server/actions/attachments/uploadAttachment";
import { deleteAttachment } from "@/server/actions/attachments/deleteAttachment";
import { getAttachmentUrl } from "@/server/actions/attachments/getAttachmentUrl";
import { getAttachments } from "@/server/actions/attachments/getAttachments";
import type { WorkspaceAttachment } from "@/server/actions/attachments/getAttachments";

type Props = {
  entityType: "deal" | "contact" | "company";
  entityId: string;
  initialAttachments: WorkspaceAttachment[];
};

const MAX_BYTES = 50 * 1024 * 1024;

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage size={15} className="text-sky-400" />;
  if (mimeType === "application/pdf") return <FileText size={15} className="text-red-400" />;
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.endsWith(".xlsx") ||
    mimeType.endsWith(".csv")
  )
    return <FileSpreadsheet size={15} className="text-emerald-400" />;
  if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("tar"))
    return <FileArchive size={15} className="text-amber-400" />;
  return <File size={15} className="text-zinc-400" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AttachmentsPanel({ entityType, entityId, initialAttachments }: Props) {
  const t = useTranslations("attachments");
  const [attachments, setAttachments] = useState<WorkspaceAttachment[]>(initialAttachments);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(t("fileTooLarge", { name: file.name }));
          continue;
        }

        const fd = new FormData();
        fd.append("file", file);
        fd.append("entityType", entityType);
        fd.append("entityId", entityId);

        const result = await uploadAttachment(fd);
        if (result.success) {
          toast.success(t("uploadSuccess", { name: result.file_name }));
        } else {
          toast.error(t("uploadFailed"));
        }
      }

      const fresh = await getAttachments(entityType, entityId);
      setAttachments(fresh);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(attachment: WorkspaceAttachment) {
    setDeletingId(attachment.id);
    const ok = await deleteAttachment(attachment.id);
    setDeletingId(null);

    if (ok) {
      setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
      toast.success(t("deleteSuccess"));
    } else {
      toast.error(t("deleteFailed"));
    }
  }

  async function handleDownload(attachment: WorkspaceAttachment) {
    setDownloadingId(attachment.id);
    const url = await getAttachmentUrl(attachment.storage_path);
    setDownloadingId(null);

    if (!url) {
      toast.error(t("downloadFailed"));
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.file_name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }

  return (
    <GunimiSection>
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <GunimiButton
          variant="secondary"
          className="mt-1 shrink-0"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={13} />
          {t("uploadButton")}
        </GunimiButton>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => {
            (e.target as HTMLInputElement).value = "";
          }}
        />
      </div>

      {/* Drag-and-drop zone + file list */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={[
          "rounded-2xl border transition-all",
          dragOver
            ? "border-violet-500/40 bg-violet-500/[0.04]"
            : "border-white/[0.08] bg-transparent",
        ].join(" ")}
      >
        {attachments.length === 0 ? (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-10 text-center"
            onClick={() => inputRef.current?.click()}
          >
            <Paperclip size={20} className="text-zinc-600" />
            <p className="text-sm text-zinc-500">{t("dropzoneLabel")}</p>
            <p className="text-xs text-zinc-600">{t("dropzoneHint")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {attachments.map((a) => (
              <li
                key={a.id}
                className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                  {fileIcon(a.mime_type)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/80">{a.file_name}</p>
                  <p className="text-[11px] text-zinc-500">
                    {formatBytes(a.file_size)} · {formatDate(a.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <GunimiButton
                    variant="secondary"
                    className="h-7 w-7 p-0"
                    loading={downloadingId === a.id}
                    onClick={() => handleDownload(a)}
                    title={t("download")}
                  >
                    <Download size={11} />
                  </GunimiButton>
                  <GunimiButton
                    variant="danger"
                    className="h-7 w-7 p-0"
                    loading={deletingId === a.id}
                    onClick={() => handleDelete(a)}
                    title={t("delete")}
                  >
                    <Trash2 size={11} />
                  </GunimiButton>
                </div>
              </li>
            ))}

            {/* Drop more files hint at bottom */}
            <li
              className="flex cursor-pointer items-center justify-center gap-2 px-4 py-3 opacity-0 transition-opacity hover:opacity-100"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={11} className="text-zinc-600" />
              <span className="text-[11px] text-zinc-600">{t("addMore")}</span>
            </li>
          </ul>
        )}
      </div>

      {uploading && (
        <p className="text-xs text-zinc-500">{t("uploading")}</p>
      )}
    </GunimiSection>
  );
}
