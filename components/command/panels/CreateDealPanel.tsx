"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";

export interface DealExtra {
  value: string;
  notes: string;
}

interface CreateDealPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: DealExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateDealPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateDealPanelProps) {
  const t = useTranslations("command");
  const [value, setValue] = useState(defaultValues?.value ?? "");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const name = query.trim();

  function handleSubmit() {
    onSubmit({ value: value.trim(), notes: notes.trim() });
  }

  function handleValueChange(next: string) {
    setValue(next);
    onDraftChange?.({ value: next, notes });
  }

  function handleNotesChange(next: string) {
    setNotes(next);
    onDraftChange?.({ value, notes: next });
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
      {name ? (
        <>
          <PanelSubmitItem
            value="create-deal-submit"
            title={
              isSubmitting
                ? t("createDealSubmittingLabel")
                : `${t("createDealSubmitPrefix")} "${name}"`
            }
            hint={t("createDealSubmitHint")}
            badgeLabel={t("createDealSubmitKey")}
            icon={TrendingUp}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createDealValuePlaceholder")}
              disabled={isSubmitting}
              className={panelInputClass}
            />
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createDealNotesPlaceholder")}
              disabled={isSubmitting}
              rows={2}
              className={`${panelInputClass} resize-none`}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createDealHint")}
          backHint={t("createDealBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
