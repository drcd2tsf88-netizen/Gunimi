"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";

export interface NoteExtra {
  content: string;
}

interface CreateNotePanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: NoteExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateNotePanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateNotePanelProps) {
  const t = useTranslations("command");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const title = query.trim();

  function handleSubmit() {
    onSubmit({ content: content.trim() });
  }

  function handleContentChange(value: string) {
    setContent(value);
    onDraftChange?.({ content: value });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  }

  return (
    <>
      {title ? (
        <>
          <PanelSubmitItem
            value="create-note-submit"
            title={
              isSubmitting
                ? t("createNoteSubmittingLabel")
                : `${t("createNoteSubmitPrefix")} "${title}"`
            }
            hint={t("createNoteSubmitHint")}
            badgeLabel={t("createNoteSubmitKey")}
            icon={StickyNote}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createNoteContentPlaceholder")}
              disabled={isSubmitting}
              rows={3}
              className={`${panelInputClass} resize-none`}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createNoteHint")}
          backHint={t("createNoteBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
